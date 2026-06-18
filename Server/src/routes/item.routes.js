import { Router } from "express"
import { addItem, updateItem, getItem, deleteItem, getAllItems } from "../controllers/item.controller.js"
import { verifyJWT, checkRole } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// Static routes first
router.get   ("/",              getAllItems)
router.post  ("/add",           verifyJWT, checkRole(["petShop"]), upload.single("image"), addItem)
router.patch ("/update/:_id",   verifyJWT, checkRole(["petShop"]), upload.single("image"), updateItem)
router.delete("/delete/:_id",   verifyJWT, checkRole(["petShop"]), deleteItem)

// Dynamic last
router.get   ("/:_id",          getItem)

export default router
