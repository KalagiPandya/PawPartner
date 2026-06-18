import "dotenv/config"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError }     from "../utils/ApiError.js"
import { ApiResponse }  from "../utils/ApiResponse.js"
import { Shop, TempShop } from "../models/pet-shop.model.js"
import { sendOTPEmail } from "../utils/mailer.js"
import jwt from "jsonwebtoken"

const COOKIE = { httpOnly: true, secure: false, sameSite: "lax" }

const genTokens = async (id) => {
  const shop = await Shop.findById(id)
  const accessToken  = shop.generateAccessToken()
  const refreshToken = shop.generateRefreshToken()
  shop.refreshToken  = refreshToken
  await shop.save({ validateBeforeSave: false })
  return { accessToken, refreshToken }
}

const registerShop = asyncHandler(async (req, res) => {
  const { email, password, contact, address, shopName, username } = req.body
  if (!email || !password || !contact || !shopName || !username)
    throw new ApiError(400, "email, password, contact, shopName and username are required")

  const exists = await Shop.findOne({ $or: [{ email: email.toLowerCase() }, { shopName: shopName.toLowerCase().trim() }] })
  if (exists) throw new ApiError(409, "Shop with this email or name already exists")

  await TempShop.deleteOne({ email: email.toLowerCase() })
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
  await TempShop.create({ email: email.toLowerCase(), password, shopName: shopName.toLowerCase().trim(), contact, address: address || "Not specified", username, otp, otpExpiry })

  const result = await sendOTPEmail(email, otp, "PawPartner — Verify Your Email")
  return res.status(200).json(new ApiResponse(200,
    result.sent ? { email } : { email, otp: result.otp, devMode: true },
    result.sent ? "OTP sent!" : `OTP: ${result.otp}`
  ))
})

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) throw new ApiError(400, "Email and OTP required")
  const temp = await TempShop.findOne({ email: email.toLowerCase() })
  if (!temp) throw new ApiError(400, "No pending registration. Please register again.")
  if (new Date() > new Date(temp.otpExpiry)) { await TempShop.deleteOne({ _id: temp._id }); throw new ApiError(400, "OTP expired") }
  if (String(temp.otp).trim() !== String(otp).trim()) throw new ApiError(400, "Invalid OTP")

  const shop = await Shop.create({ email: temp.email, password: temp.password, shopName: temp.shopName, contact: temp.contact, address: temp.address, username: temp.username })
  await TempShop.deleteOne({ _id: temp._id })
  const { accessToken, refreshToken } = await genTokens(shop._id)
  const safe = await Shop.findById(shop._id).select("-password -refreshToken")
  return res.status(201)
    .cookie("accessToken", accessToken, COOKIE)
    .cookie("refreshToken", refreshToken, COOKIE)
    .json(new ApiResponse(200, { shop: safe, accessToken, refreshToken }, "Registration successful!"))
})

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body
  const temp = await TempShop.findOne({ email: email.toLowerCase() })
  if (!temp) throw new ApiError(404, "No pending registration")
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  temp.otp = otp; temp.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); await temp.save()
  const result = await sendOTPEmail(email, otp)
  return res.status(200).json(new ApiResponse(200, result.sent ? { email } : { email, otp: result.otp, devMode: true }, result.sent ? "OTP resent!" : `New OTP: ${result.otp}`))
})

const loginShop = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new ApiError(400, "Email and password required")
  const shop = await Shop.findOne({ email: email.toLowerCase() })
  if (!shop) throw new ApiError(404, "Pet shop not found. Please register first.")
  const valid = await shop.isPasswordCorrect(password)
  if (!valid) throw new ApiError(401, "Incorrect password")
  const { accessToken, refreshToken } = await genTokens(shop._id)
  const safe = await Shop.findById(shop._id).select("-password -refreshToken")
  return res.status(200)
    .cookie("accessToken", accessToken, COOKIE)
    .cookie("refreshToken", refreshToken, COOKIE)
    .json(new ApiResponse(200, { shop: safe, accessToken, refreshToken }, "Login successful"))
})

const logoutShop = asyncHandler(async (req, res) => {
  await Shop.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } })
  return res.status(200).clearCookie("accessToken", COOKIE).clearCookie("refreshToken", COOKIE).json(new ApiResponse(200, {}, "Logged out"))
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const shop = await Shop.findOne({ email: email.toLowerCase() })
  if (!shop) throw new ApiError(404, "No pet shop with this email")
  await TempShop.deleteOne({ email: email.toLowerCase() })
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
  await TempShop.create({ email: email.toLowerCase(), password: "reset_placeholder", shopName: shop.shopName, contact: shop.contact, address: shop.address || "reset", username: shop.username || "reset", otp, otpExpiry })
  const result = await sendOTPEmail(email, otp, "PawPartner — Password Reset")
  return res.status(200).json(new ApiResponse(200, result.sent ? { email } : { email, otp: result.otp, devMode: true }, result.sent ? "Reset OTP sent!" : `Reset OTP: ${result.otp}`))
})

const verifyResetPasswordOTP = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body
  const temp = await TempShop.findOne({ email: email.toLowerCase() })
  if (!temp || new Date() > new Date(temp.otpExpiry)) throw new ApiError(400, "OTP expired or invalid")
  if (String(temp.otp).trim() !== String(otp).trim()) throw new ApiError(400, "Invalid OTP")
  const shop = await Shop.findOne({ email: email.toLowerCase() })
  shop.password = newPassword; await shop.save()
  await TempShop.deleteOne({ _id: temp._id })
  return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully!"))
})

const getAllShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find().select("-password -refreshToken")
  return res.status(200).json(new ApiResponse(200, shops, "Fetched"))
})

const getShopProfile    = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, req.user, "Profile fetched")))
const updateShopDetails = asyncHandler(async (req, res) => {
  const shop = await Shop.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true }).select("-password")
  return res.status(200).json(new ApiResponse(200, shop, "Updated"))
})
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken
  if (!token) throw new ApiError(401, "Refresh token required")
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
  const shop = await Shop.findById(decoded._id)
  if (!shop || token !== shop.refreshToken) throw new ApiError(401, "Invalid token")
  const { accessToken, refreshToken } = await genTokens(shop._id)
  return res.status(200).cookie("accessToken", accessToken, COOKIE).cookie("refreshToken", refreshToken, COOKIE).json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed"))
})

export { registerShop, verifyOTP, resendOTP, loginShop, logoutShop, forgotPassword, verifyResetPasswordOTP, getAllShops, getShopProfile, updateShopDetails, refreshAccessToken }
