import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
        },

        description: {
            type: String,
            required: true,
        },

        shortDescription: {
            type: String,
            default: "",
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        discountPrice: {
            type: Number,
            default: 0,
        },

        stock: {
            type: Number,
            default: 0,
        },

        sku: {
            type: String,
            default: "",
        },

        thumbnail: {
            type: String,
            default: "",
        },

        images: [
            {
                type: String,
            },
        ],

        featured: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        specifications: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

productSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        const base = slugify(this.name, {
            lower: true,
            strict: true,
        });
        // Append a short timestamp suffix to guarantee uniqueness
        this.slug = `${base}-${Date.now()}`;
    }
    next();
});

export default mongoose.model("Product", productSchema);