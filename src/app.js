import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

// Request Logging
app.use(morgan("dev"));

// Body Parser
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
});

app.use(limiter);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "E-Commerce Backend Running Successfully 🚀",
    });
});

export default app;