import { Router } from "express"
import { addAdoptionCenterPet, updateAdoptionCenterPet, getAdoptionCenterPets, deleteAdoptionCenterPet } from "../controllers/center-pet.controller.js"
import { verifyJWT, checkRole } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// IMPORTANT: static routes BEFORE dynamic /:_id
router.post   ("/add",           verifyJWT, checkRole(["adoptionCenter"]), upload.single("image"), addAdoptionCenterPet)
router.patch  ("/update/:_id",   verifyJWT, checkRole(["adoptionCenter"]), upload.single("image"), updateAdoptionCenterPet)
router.delete ("/delete/:_id",   verifyJWT, checkRole(["adoptionCenter"]), deleteAdoptionCenterPet)

// Public: get pets by center ID
router.get("/:_id", getAdoptionCenterPets)

export default router
