import "dotenv/config"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError }     from "../utils/ApiError.js"
import { ApiResponse }  from "../utils/ApiResponse.js"
import { OwnedPet }     from "../models/owned-pet.model.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"

const addOwnedPet = asyncHandler(async (req, res) => {
  const { name, type, breed, age, gender, description } = req.body
  const owner = req.user._id
  if (!name || !type || !breed || !age || !gender || !description)
    throw new ApiError(400, "All fields are required")

  let imageUrl = ""
  if (req.file) {
    imageUrl = await uploadOnCloudinary(req.file.path) || ""
  }

  const pet = await OwnedPet.create({ name, type, breed, age, gender, description, imageUrl, owner })
  return res.status(201).json(new ApiResponse(201, pet, "Pet added successfully"))
})

const updateOwnedPet = asyncHandler(async (req, res) => {
  const { name, type, breed, age, gender, description } = req.body
  const petId = req.params._id
  const pet   = await OwnedPet.findById(petId)
  if (!pet) throw new ApiError(404, "Pet not found")
  if (pet.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized")

  const updates = {}
  if (name)        updates.name        = name
  if (type)        updates.type        = type
  if (breed)       updates.breed       = breed
  if (age)         updates.age         = age
  if (gender)      updates.gender      = gender
  if (description) updates.description = description

  if (req.file) {
    const url = await uploadOnCloudinary(req.file.path)
    if (url) updates.imageUrl = url
  }

  const updated = await OwnedPet.findByIdAndUpdate(petId, { $set: updates }, { new: true })
  return res.status(200).json(new ApiResponse(200, updated, "Pet updated successfully"))
})

const getOwnedPets = asyncHandler(async (req, res) => {
  const pets = await OwnedPet.find({ owner: req.user._id })
  return res.status(200).json(new ApiResponse(200, pets, "Pets fetched successfully"))
})

const deleteOwnedPet = asyncHandler(async (req, res) => {
  const pet = await OwnedPet.findById(req.params._id)
  if (!pet) throw new ApiError(404, "Pet not found")
  if (pet.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized")
  if (pet.imageUrl) await deleteFromCloudinary(pet.imageUrl)
  await OwnedPet.findByIdAndDelete(req.params._id)
  return res.status(200).json(new ApiResponse(200, {}, "Pet deleted successfully"))
})

export { addOwnedPet, updateOwnedPet, getOwnedPets, deleteOwnedPet }
