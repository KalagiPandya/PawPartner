import { Router } from "express"
import {
    registerAdoptionCenter, verifyOTP, resendOTP,
    loginAdoptionCenter, logoutAdoptionCenter,
    forgotPassword, verifyResetPasswordOTP,
    allAdoptionCenters, getAdoptionCenter, updateAdoptionCenter, refreshAccessToken
} from "../controllers/adoption-center.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/",                            allAdoptionCenters)
router.post("/register",                   registerAdoptionCenter)
router.post("/verify-otp",                 verifyOTP)
router.post("/resend-otp",                 resendOTP)
router.post("/login",                      loginAdoptionCenter)
router.post("/forgot-password",            forgotPassword)
router.post("/verify-reset-password-otp",  verifyResetPasswordOTP)
router.post("/refresh-token",              refreshAccessToken)

router.post("/logout",             verifyJWT, logoutAdoptionCenter)
router.get("/profile",             verifyJWT, getAdoptionCenter)
router.patch("/update-details",    verifyJWT, updateAdoptionCenter)

export default router
