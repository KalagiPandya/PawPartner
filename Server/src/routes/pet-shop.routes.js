import { Router } from "express"
import {
    registerShop, verifyOTP, resendOTP,
    loginShop, logoutShop,
    forgotPassword, verifyResetPasswordOTP,
    getAllShops, getShopProfile, updateShopDetails, refreshAccessToken
} from "../controllers/pet-shop.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/",                            getAllShops)
router.post("/register",                   registerShop)
router.post("/verify-otp",                 verifyOTP)
router.post("/resend-otp",                 resendOTP)
router.post("/login",                      loginShop)
router.post("/forgot-password",            forgotPassword)
router.post("/verify-reset-password-otp",  verifyResetPasswordOTP)
router.post("/refresh-token",              refreshAccessToken)

router.post("/logout",             verifyJWT, logoutShop)
router.get("/profile",             verifyJWT, getShopProfile)
router.patch("/update-details",    verifyJWT, updateShopDetails)

export default router
