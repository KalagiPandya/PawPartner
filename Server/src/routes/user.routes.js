import "dotenv/config"
import { Router } from "express"
import {
    registerUser, verifyOTP, resendOTP,
    loginUser, logoutUser,
    forgotPassword, verifyResetPasswordOTP,
    refreshAccessToken, getCurrentUser, updateUserDetails
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import passport from "passport"

const router = Router()

// Public routes
router.post("/register",                  registerUser)
router.post("/verify-otp",                verifyOTP)
router.post("/resend-otp",                resendOTP)
router.post("/login",                     loginUser)
router.post("/forgot-password",           forgotPassword)
router.post("/verify-reset-password-otp", verifyResetPasswordOTP)
router.post("/refresh-token",             refreshAccessToken)

// Google OAuth (only registered if configured)
if (process.env.GOOGLE_CLIENT_ID) {
  router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile","email"] })
  )
  router.get("/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:5173/signin?error=google_failed",
      session: false
    }),
    (req, res) => {
      const token = req.user?.accessToken
      if (token) {
        res.cookie("accessToken", token, { httpOnly: true, secure: false, sameSite: "lax" })
        res.redirect(`http://localhost:5173/additional-info?token=${token}`)
      } else {
        res.redirect("http://localhost:5173/signin?error=google_failed")
      }
    }
  )
}

// Protected routes
router.post  ("/logout",       verifyJWT, logoutUser)
router.get   ("/current-user", verifyJWT, getCurrentUser)
router.patch ("/update-user",  verifyJWT, updateUserDetails)

export default router
