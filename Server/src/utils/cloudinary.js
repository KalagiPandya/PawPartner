import {v2 as cloudinary} from "cloudinary"
import { unlink } from "node:fs/promises"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            // No Cloudinary configured — return a placeholder
            console.warn("Cloudinary not configured. Skipping upload.")
            try { await unlink(localFilePath) } catch {}
            return "https://placehold.co/400x300?text=Pet+Photo"
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            transformation: [
                {width: 1000, crop: "scale"},
                {quality: "auto"},
                {fetch_format: "auto"}
            ]   
        })
        try { await unlink(localFilePath) } catch {}
        return response.secure_url;
    } catch (error) {
        try { await unlink(localFilePath) } catch {}
        console.error("Cloudinary upload error:", error.message)
        return null;
    }
}

const deleteFromCloudinary = async (imageUrl) => {
    try {
        if (!imageUrl) return null
        const publicId = imageUrl.split("/").pop().split(".")[0];
        const response = await cloudinary.uploader.destroy(publicId)
        return response;
    } catch (error) {
        console.error("Cloudinary delete error:", error.message)
        return null;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}
