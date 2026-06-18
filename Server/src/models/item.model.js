import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        weight: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["food", "toy", "accessory", "medicine"],
            required: true
        },
        imageUrl: {
            type: String,
            default: "https://placehold.co/400x300?text=Product"
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Item = mongoose.model("Item", itemSchema);

export { Item };