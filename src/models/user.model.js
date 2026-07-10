import { generateToken } from "../utils/jwt.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please enter a valid email"],
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },

        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },

        avatar: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

/*
|--------------------------------------------------------------------------
| Hash Password Before Save
|--------------------------------------------------------------------------
*/

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

/*
|--------------------------------------------------------------------------
| Compare Password
|--------------------------------------------------------------------------
*/

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/*
|--------------------------------------------------------------------------
| Generate JWT Token
|--------------------------------------------------------------------------
*/

userSchema.methods.generateToken = function () {
    return generateToken({
        id: this._id,
        role: this.role,
    });
};

const User = mongoose.model("User", userSchema);

export default User;