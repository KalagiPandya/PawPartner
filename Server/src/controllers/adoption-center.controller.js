import "dotenv/config"
import { asyncHandler }    from "../utils/asyncHandler.js"
import { ApiError }        from "../utils/ApiError.js"
import { ApiResponse }     from "../utils/ApiResponse.js"
import { AdoptionCenter, TempAdoptionCenter } from "../models/adoption-center.model.js"
import { sendOTPEmail }    from "../utils/mailer.js"
import jwt from "jsonwebtoken"

const COOKIE = { httpOnly: true, secure: false, sameSite: "lax" }

const genTokens = async (id) => {
  const c = await AdoptionCenter.findById(id)
  const accessToken  = c.generateAccessToken()
  const refreshToken = c.generateRefreshToken()
  c.refreshToken = refreshToken
  await c.save({ validateBeforeSave: false })
  return { accessToken, refreshToken }
}

const registerAdoptionCenter = asyncHandler(async (req, res) => {
  const { email, password, adoptionCenterName, address, contact, adoptionCenterDescription } = req.body
  if (!email || !password || !adoptionCenterName || !address || !contact || !adoptionCenterDescription)
    throw new ApiError(400, "All fields are required")

  const exists = await AdoptionCenter.findOne({ $or: [{ email: email.toLowerCase() }, { adoptionCenterName }] })
  if (exists) throw new ApiError(409, "Adoption center already exists")

  await TempAdoptionCenter.deleteOne({ email: email.toLowerCase() })
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
  await TempAdoptionCenter.create({ email: email.toLowerCase(), password, adoptionCenterName, address, contact, adoptionCenterDescription, otp, otpExpiry })

  const result = await sendOTPEmail(email, otp, "PawPartner — Verify Your Email")
  return res.status(200).json(new ApiResponse(200,
    result.sent ? { email } : { email, otp: result.otp, devMode: true },
    result.sent ? "OTP sent!" : `OTP: ${result.otp}`
  ))
})

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) throw new ApiError(400, "Email and OTP required")
  const temp = await TempAdoptionCenter.findOne({ email: email.toLowerCase() })
  if (!temp) throw new ApiError(400, "No pending registration. Please register again.")
  if (new Date() > new Date(temp.otpExpiry)) { await TempAdoptionCenter.deleteOne({ _id: temp._id }); throw new ApiError(400, "OTP expired") }
  if (String(temp.otp).trim() !== String(otp).trim()) throw new ApiError(400, "Invalid OTP")

  const center = await AdoptionCenter.create({ email: temp.email, password: temp.password, adoptionCenterName: temp.adoptionCenterName, address: temp.address, contact: temp.contact, adoptionCenterDescription: temp.adoptionCenterDescription })
  await TempAdoptionCenter.deleteOne({ _id: temp._id })
  const { accessToken, refreshToken } = await genTokens(center._id)
  const safe = await AdoptionCenter.findById(center._id).select("-password -refreshToken")
  return res.status(201)
    .cookie("accessToken", accessToken, COOKIE)
    .cookie("refreshToken", refreshToken, COOKIE)
    .json(new ApiResponse(200, { center: safe, accessToken, refreshToken }, "Registration successful!"))
})

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body
  const temp = await TempAdoptionCenter.findOne({ email: email.toLowerCase() })
  if (!temp) throw new ApiError(404, "No pending registration")
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  temp.otp = otp; temp.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); await temp.save()
  const result = await sendOTPEmail(email, otp)
  return res.status(200).json(new ApiResponse(200, result.sent ? { email } : { email, otp: result.otp, devMode: true }, result.sent ? "OTP resent!" : `New OTP: ${result.otp}`))
})

const loginAdoptionCenter = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new ApiError(400, "Email and password required")
  const center = await AdoptionCenter.findOne({ email: email.toLowerCase() })
  if (!center) throw new ApiError(404, "Adoption center not found. Please register first.")
  const valid = await center.isPasswordCorrect(password)
  if (!valid) throw new ApiError(401, "Incorrect password")
  const { accessToken, refreshToken } = await genTokens(center._id)
  const safe = await AdoptionCenter.findById(center._id).select("-password -refreshToken")
  return res.status(200)
    .cookie("accessToken", accessToken, COOKIE)
    .cookie("refreshToken", refreshToken, COOKIE)
    .json(new ApiResponse(200, { center: safe, accessToken, refreshToken }, "Login successful"))
})

const logoutAdoptionCenter = asyncHandler(async (req, res) => {
  await AdoptionCenter.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } })
  return res.status(200).clearCookie("accessToken", COOKIE).clearCookie("refreshToken", COOKIE).json(new ApiResponse(200, {}, "Logged out"))
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const center = await AdoptionCenter.findOne({ email: email.toLowerCase() })
  if (!center) throw new ApiError(404, "No adoption center with this email")
  await TempAdoptionCenter.deleteOne({ email: email.toLowerCase() })
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
  await TempAdoptionCenter.create({ email: email.toLowerCase(), password: "reset_placeholder", adoptionCenterName: center.adoptionCenterName, address: center.address, contact: center.contact, adoptionCenterDescription: center.adoptionCenterDescription, otp, otpExpiry })
  const result = await sendOTPEmail(email, otp, "PawPartner — Password Reset")
  return res.status(200).json(new ApiResponse(200, result.sent ? { email } : { email, otp: result.otp, devMode: true }, result.sent ? "Reset OTP sent!" : `Reset OTP: ${result.otp}`))
})

const verifyResetPasswordOTP = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body
  const temp = await TempAdoptionCenter.findOne({ email: email.toLowerCase() })
  if (!temp || new Date() > new Date(temp.otpExpiry)) throw new ApiError(400, "OTP expired or invalid")
  if (String(temp.otp).trim() !== String(otp).trim()) throw new ApiError(400, "Invalid OTP")
  const center = await AdoptionCenter.findOne({ email: email.toLowerCase() })
  center.password = newPassword; await center.save()
  await TempAdoptionCenter.deleteOne({ _id: temp._id })
  return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully!"))
})

const allAdoptionCenters = asyncHandler(async (req, res) => {
  const centers = await AdoptionCenter.find().select("-password -refreshToken")
  return res.status(200).json(new ApiResponse(200, centers, "Fetched"))
})

const getAdoptionCenter = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, req.user, "Profile fetched")))

const updateAdoptionCenter = asyncHandler(async (req, res) => {
  const center = await AdoptionCenter.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true }).select("-password")
  return res.status(200).json(new ApiResponse(200, center, "Updated"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken
  if (!token) throw new ApiError(401, "Refresh token required")
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
  const center  = await AdoptionCenter.findById(decoded._id)
  if (!center || token !== center.refreshToken) throw new ApiError(401, "Invalid token")
  const { accessToken, refreshToken } = await genTokens(center._id)
  return res.status(200).cookie("accessToken", accessToken, COOKIE).cookie("refreshToken", refreshToken, COOKIE).json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed"))
})

export { registerAdoptionCenter, verifyOTP, resendOTP, loginAdoptionCenter, logoutAdoptionCenter, forgotPassword, verifyResetPasswordOTP, allAdoptionCenters, getAdoptionCenter, updateAdoptionCenter, refreshAccessToken }
