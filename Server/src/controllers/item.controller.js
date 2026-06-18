import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError }      from "../utils/ApiError.js"
import { ApiResponse }   from "../utils/ApiResponse.js"
import { Item }          from "../models/item.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const addItem = asyncHandler(async (req, res) => {
    const { name, weight, description, type } = req.body
    const seller = req.user._id
    if (!name || !weight || !description || !type)
        throw new ApiError(400, "name, weight, description and type are required")

    let imageUrl = "https://placehold.co/400x300?text=Product"
    if (req.file) {
        const uploaded = await uploadOnCloudinary(req.file.path)
        if (uploaded) imageUrl = uploaded
    }

    const item = await Item.create({ name, weight, description, type, imageUrl, seller })
    res.status(201).json(new ApiResponse(201, item, "Item added successfully"))
})

const updateItem = asyncHandler(async (req, res) => {
    const itemId = req.params._id
    const item   = await Item.findById(itemId)
    if (!item) throw new ApiError(404, "Item not found")
    if (item.seller.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized")

    const updates = { ...req.body }
    if (req.file) {
        const url = await uploadOnCloudinary(req.file.path)
        if (url) updates.imageUrl = url
    }

    const updated = await Item.findByIdAndUpdate(itemId, updates, { new: true })
    res.status(200).json(new ApiResponse(200, updated, "Item updated successfully"))
})

const getItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params._id).populate("seller","shopName")
    if (!item) throw new ApiError(404, "Item not found")
    res.status(200).json(new ApiResponse(200, item, "Item fetched"))
})

const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params._id)
    if (!item) throw new ApiError(404, "Item not found")
    if (item.seller.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized")
    await Item.findByIdAndDelete(req.params._id)
    res.status(200).json(new ApiResponse(200, {}, "Item deleted"))
})

const getAllItems = asyncHandler(async (req, res) => {
    const items = await Item.find().populate("seller","shopName")
    res.status(200).json(new ApiResponse(200, items, "Items fetched"))
})

export { addItem, updateItem, getItem, deleteItem, getAllItems }
