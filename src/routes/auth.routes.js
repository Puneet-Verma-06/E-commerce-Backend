import express from "express";
import {
    register,
    verifyOTP,
    login,
    resendOTP,
    forgotPassword,
    resetPassword,
    getMe,
    changePassword,
    logout,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);
router.post("/logout", protect, logout);

export default router;