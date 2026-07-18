import dotenv from "dotenv";
dotenv.config();

import app from "../src/app.js";
import connectDB from "../src/config/database.js";

// Connect to DB (Vercel keeps connections warm between invocations)
connectDB();

// Export app for Vercel serverless — do NOT call app.listen()
export default app;
