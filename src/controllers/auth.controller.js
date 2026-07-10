import User from "../models/user.model.js";

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
            password
        } = req.body;

        // Check existing email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Create user
        const user = await User.create({
    name,
    email,
    phone,
    password,
});

const token = user.generateToken();

// Remove password before sending response
user.password = undefined;

return res.status(201).json({
    success: true,
    message: "Registration successful",
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