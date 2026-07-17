import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        // slug of the product (used for static / local products)
        productSlug: {
            type: String,
            required: true,
            trim: true,
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        title: {
            type: String,
            trim: true,
            default: "",
        },

        comment: {
            type: String,
            required: true,
            trim: true,
        },

        verified: {
            type: Boolean,
            default: true, // all reviews here are verified purchases
        },
    },
    {
        timestamps: true,
    }
);

// One review per customer per product per order
reviewSchema.index({ productSlug: 1, customer: 1, order: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
