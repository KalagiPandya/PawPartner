import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AdoptionCenterPet } from "../models/center-pet.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addAdoptionCenterPet = asyncHandler(async (req, res) => {
    const { name, type, breed, age, gender, description } = req.body;
    const adoptionCenter = req.user._id;

    if (!name || !type || !breed || !age || !gender || !description) {
        throw new ApiError(400, "All fields are required");
    }

    let imageUrl = "";
    if (req.file) {
        if (req.file.size > 5 * 1024 * 1024) throw new ApiError(400, "Image size should be less than 5MB");
        imageUrl = await uploadOnCloudinary(req.file.path) || "";
    }

    const pet = await AdoptionCenterPet.create({ name, type, breed, age, gender, description, imageUrl, adoptionCenter });
    res.status(201).json(new ApiResponse(201, pet, "Pet added successfully"));
});

const updateAdoptionCenterPet = asyncHandler(async (req, res) => {
    const petId = req.params._id;
    const { name, type, breed, age, gender, description } = req.body;

    const pet = await AdoptionCenterPet.findById(petId);
    if (!pet) throw new ApiError(404, "Pet not found");
    if (pet.adoptionCenter.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized");

    const updates = { name, type, breed, age, gender, description };
    if (req.file) {
        const newUrl = await uploadOnCloudinary(req.file.path);
        if (newUrl) updates.imageUrl = newUrl;
    }

    const updatedPet = await AdoptionCenterPet.findByIdAndUpdate(petId, updates, { new: true });
    res.status(200).json(new ApiResponse(200, updatedPet, "Pet updated successfully"));
});

const getAdoptionCenterPets = asyncHandler(async (req, res) => {
    const centerId = req.params._id;
    const pets = await AdoptionCenterPet.find({ adoptionCenter: centerId });
    return res.status(200).json(new ApiResponse(200, pets, "Pets fetched successfully"));
});

const deleteAdoptionCenterPet = asyncHandler(async (req, res) => {
    const petId = req.params._id;
    const pet = await AdoptionCenterPet.findById(petId);
    if (!pet) throw new ApiError(404, "Pet not found");
    if (pet.adoptionCenter.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized");
    await AdoptionCenterPet.findByIdAndDelete(petId);
    res.status(200).json(new ApiResponse(200, {}, "Pet deleted successfully"));
});

export { addAdoptionCenterPet, updateAdoptionCenterPet, getAdoptionCenterPets, deleteAdoptionCenterPet };
