import "dotenv/config"
import { asyncHandler }  from "../utils/asyncHandler.js"
import { ApiError }      from "../utils/ApiError.js"
import { ApiResponse }   from "../utils/ApiResponse.js"
import { User, TempUser } from "../models/user.model.js"
import { sendOTPEmail }  from "../utils/mailer.js"
import jwt from "jsonwebtoken"

const COOKIE = { httpOnly: true, secure: false, sameSite: "lax" }

const genTokens = async (userId) => {
  const user = await User.findById(userId)
  const accessToken  = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()
  user.refreshToken  = refreshToken
  await user.save({ validateBeforeSave: false })
  return { accessToken, refreshToken }
}

// REGISTER
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, contact, address } = req.body
  if (!email || !username || !password || !contact || !address)
    throw new ApiError(400, "All fields are required")

  const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] })
  if (exists) throw new ApiError(409, "User with this email or username already exists")

  await TempUser.deleteOne({ email: email.toLowerCase() })

  const otp       = String(Math.floor(100000 + Math.random() * 900000))
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

  await TempUser.create({ email: email.toLowerCase(), username, password, contact, address, otp, otpExpiry })

  const result = await sendOTPEmail(email, otp, "PawPartner — Verify Your Email")
  return res.status(200).json(new ApiResponse(200,
    result.sent ? { email } : { email, otp: result.otp, devMode: true },
    result.sent ? "OTP sent to your email!" : `OTP: ${result.otp}`
  ))
})

// VERIFY OTP
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) throw new ApiError(400, "Email and OTP are required")

  const temp = await TempUser.findOne({ email: email.toLowerCase() })
  if (!temp) throw new ApiError(400, "No pending registration. Please register again.")
  if (new Date() > new Date(temp.otpExpiry)) {
    await TempUser.deleteOne({ _id: temp._id })
    throw new ApiError(400, "OTP expired. Please register again.")
  }
  if (String(temp.otp).trim() !== String(otp).trim())
    throw new ApiError(400, "Invalid OTP. Please try again.")

  const user = await User.create({
    email: temp.email, username: temp.username,
    password: temp.password, contact: temp.contact, address: temp.address
  })
  await TempUser.deleteOne({ _id: temp._id })

  const { accessToken, refreshToken } = await genTokens(user._id)
  const safe = await User.findById(user._id).select("-password -refreshToken")
  return res.status(201)
    .cookie("accessToken", accessToken, COOKIE)
    .cookie("refreshToken", refreshToken, COOKIE)
    .json(new ApiResponse(200, { user: safe, accessToken, refreshToken }, "Registration successful!"))
})

// RESEND OTP
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body
  const temp = await TempUser.findOne({ email: email.toLowerCase() })
  if (!temp) throw new ApiError(404, "No pending registration found")
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  temp.otp = otp; temp.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
  await temp.save()
  const result = await sendOTPEmail(email, otp)
  return res.status(200).json(new ApiResponse(200,
    result.sent ? { email } : { email, otp: result.otp, devMode: true },
    result.sent ? "OTP resent!" : `New OTP: ${result.otp}`
  ))
})

// LOGIN
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body
  if (!password) throw new ApiError(400, "Password is required")
  if (!email && !username) throw new ApiError(400, "Email or username is required")

  const user = await User.findOne(email ? { email: email.toLowerCase() } : { username })
  if (!user) throw new ApiError(404, "User not found. Please register first.")

  const valid = await user.isPasswordCorrect(password)
  if (!valid) throw new ApiError(401, "Incorrect password")

  const { accessToken, refreshToken } = await genTokens(user._id)
  const safe = await User.findById(user._id).select("-password -refreshToken")
  return res.status(200)
    .cookie("accessToken", accessToken, COOKIE)
    .cookie("refreshToken", refreshToken, COOKIE)
    .json(new ApiResponse(200, { user: safe, accessToken, refreshToken }, "Login successful"))
})

// LOGOUT
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } })
  return res.status(200)
    .clearCookie("accessToken", COOKIE)
    .clearCookie("refreshToken", COOKIE)
    .json(new ApiResponse(200, {}, "Logged out"))
})

// FORGOT PASSWORD
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) throw new ApiError(400, "Email is required")
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) throw new ApiError(404, "No account with this email")

  await TempUser.deleteOne({ email: email.toLowerCase() })
  const otp       = String(Math.floor(100000 + Math.random() * 900000))
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
  await TempUser.create({ email: email.toLowerCase(), username: user.username, password: "reset_placeholder", contact: user.contact || "0000000000", address: user.address || "reset", otp, otpExpiry })

  const result = await sendOTPEmail(email, otp, "PawPartner — Password Reset")
  return res.status(200).json(new ApiResponse(200,
    result.sent ? { email } : { email, otp: result.otp, devMode: true },
    result.sent ? "Reset OTP sent!" : `Reset OTP: ${result.otp}`
  ))
})

// VERIFY RESET OTP
const verifyResetPasswordOTP = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body
  if (!email || !otp || !newPassword) throw new ApiError(400, "All fields required")
  const temp = await TempUser.findOne({ email: email.toLowerCase() })
  if (!temp || new Date() > new Date(temp.otpExpiry)) throw new ApiError(400, "OTP expired or invalid")
  if (String(temp.otp).trim() !== String(otp).trim()) throw new ApiError(400, "Invalid OTP")
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) throw new ApiError(404, "User not found")
  user.password = newPassword
  await user.save()
  await TempUser.deleteOne({ _id: temp._id })
  return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully!"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken
  if (!token) throw new ApiError(401, "Refresh token required")
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
  const user = await User.findById(decoded._id)
  if (!user || token !== user.refreshToken) throw new ApiError(401, "Invalid token")
  const { accessToken, refreshToken } = await genTokens(user._id)
  return res.status(200)
    .cookie("accessToken", accessToken, COOKIE)
    .cookie("refreshToken", refreshToken, COOKIE)
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed"))
})

const getCurrentUser    = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, req.user, "User fetched")))
const updateUserDetails = asyncHandler(async (req, res) => {
  const { username, email, address, contact } = req.body
  const user = await User.findByIdAndUpdate(req.user._id, { $set: { username, email, address, contact } }, { new: true }).select("-password")
  return res.status(200).json(new ApiResponse(200, user, "Profile updated"))
})

export const generateAccessAndRefereshTokens = genTokens
export { registerUser, verifyOTP, resendOTP, loginUser, logoutUser, forgotPassword, verifyResetPasswordOTP, refreshAccessToken, getCurrentUser, updateUserDetails }
