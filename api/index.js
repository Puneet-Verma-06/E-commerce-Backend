import dotenv from "dotenv";
dotenv.config();

import app from "../src/app.js";
import mongoose from "mongoose";

// Cache DB connection across warm invocations
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    if (!process.env.MONGODB_URI) {
        console.error("❌ MONGODB_URI is not set in environment variables");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
        // Do NOT call process.exit() in serverless — it kills the function
    }
};

connectDB();

export default app;
