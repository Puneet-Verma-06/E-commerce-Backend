import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                name: String,

                thumbnail: String,

                price: Number,

                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },

                total: Number,
            },
        ],

        subtotal: {
            type: Number,
            required: true,
        },

        shippingCharge: {
            type: Number,
            default: 0,
        },

        discount: {
            type: Number,
            default: 0,
        },

        total: {
            type: Number,
            required: true,
        },

        shippingAddress: {
            fullName: String,
            phone: String,
            address: String,
            city: String,
            state: String,
            country: String,
            pincode: String,
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed", "Refunded"],
            default: "Pending",
        },

        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
            ],
            default: "Pending",
        },

        notes: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Order", orderSchema);