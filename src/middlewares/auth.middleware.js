import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login.",
            });
        }

        // Verify JWT
        const decoded = verifyToken(token);

        // Find user
        const user = await User.findById(decoded.id).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });

    }
};

/*
|--------------------------------------------------------------------------
| Admin Guard — must be used after protect
|--------------------------------------------------------------------------
*/

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
    });
};