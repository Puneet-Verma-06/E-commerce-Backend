import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import { hashOTP } from "../utils/otp.js";
import {
    sendRegistrationOTP,
    sendForgotPasswordOTP,
} from "../services/otp.service.js";
/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

export const register = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            password,
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email },
                { phone },
            ],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists.",
            });
        }

        // Send OTP
        await sendRegistrationOTP({
    name,
    email,
    phone,
    password,
});
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
            data: {
                email,
            },
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find OTP record
// Find OTP record by email
const otpRecord = await OTP.findOne({ email });

if (!otpRecord) {
    return res.status(400).json({
        success: false,
        message: "No OTP request found.",
    });
}

// Compare OTP
if (otpRecord.otp !== hashOTP(otp)) {
    return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
    });
}
        // Check expiry
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });

            return res.status(400).json({
                success: false,
                message: "OTP has expired.",
            });
        }

        // Create User
        const user = await User.create({
            name: otpRecord.name,
            email: otpRecord.email,
            phone: otpRecord.phone,
            password: otpRecord.password,
        });

        // Delete OTP after successful verification
        await OTP.deleteOne({ _id: otpRecord._id });

        const token = user.generateToken();

        user.password = undefined;

        return res.status(201).json({
            success: true,
            message: "Registration completed successfully.",
            token,
            user,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


export const login = async (req, res) => {
    try {

        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json({
                success: false,
                message: "Login and password are required.",
            });
        }

        // Find user by email or phone
        const user = await User.findOne({
            $or: [
                { email: login },
                { phone: login },
            ],
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        const token = user.generateToken();

        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};



/*
|--------------------------------------------------------------------------
| Get Logged In User
|--------------------------------------------------------------------------
*/

export const getMe = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};



/*
|--------------------------------------------------------------------------
| Resend Registration OTP
|--------------------------------------------------------------------------
*/

export const resendOTP = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        // Find pending OTP request
        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(404).json({
                success: false,
                message: "No registration request found.",
            });
        }

        // Send new OTP
        await sendRegistrationOTP({
            name: otpRecord.name,
            email: otpRecord.email,
            phone: otpRecord.phone,
            password: otpRecord.password,
        });

        return res.status(200).json({
            success: true,
            message: "OTP resent successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        // Check user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Send Reset OTP
        await sendForgotPasswordOTP({
            name: user.name,
            email: user.email,
        });

        return res.status(200).json({
            success: true,
            message: "Password reset OTP sent successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


/*
|--------------------------------------------------------------------------
| Send Forgot Password OTP
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export const resetPassword = async (req, res) => {
    try {

        const { email, otp, password } = req.body;

        const otpRecord = await OTP.findOne({
            email,
            purpose: "forgot-password",
        });

        if (!otpRecord) {
            return res.status(404).json({
                success: false,
                message: "No password reset request found.",
            });
        }

        if (otpRecord.otp !== hashOTP(otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });

            return res.status(400).json({
                success: false,
                message: "OTP has expired.",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.password = password;
        await user.save();

        await OTP.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};



/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePassword = async (req, res) => {
    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select("+password");

        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }

        user.password = newPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logout = async (req, res) => {

    return res.status(200).json({
        success: true,
        message: "Logged out successfully.",
    });

};