import { ApiError }     from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt              from "jsonwebtoken"
import { User }         from "../models/user.model.js"
import { AdoptionCenter } from "../models/adoption-center.model.js"
import { Shop }         from "../models/pet-shop.model.js"

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Check cookie first, then Authorization header
    let token = req.cookies?.accessToken
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]
    }
    if (!token) throw new ApiError(401, "Unauthorized — please sign in")

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    // Find user across all three collections
    const entity =
      await User.findById(decoded._id).select("-password -refreshToken") ||
      await AdoptionCenter.findById(decoded._id).select("-password -refreshToken") ||
      await Shop.findById(decoded._id).select("-password -refreshToken")

    if (!entity) throw new ApiError(401, "Invalid access token")

    req.user = entity
    next()
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid access token")
  }
})

const checkRole = (roles) => asyncHandler(async (req, _, next) => {
  if (!roles.includes(req.user.role)) throw new ApiError(403, "Access forbidden")
  next()
})

export { verifyJWT, checkRole }
