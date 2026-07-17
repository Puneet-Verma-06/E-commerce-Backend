import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import bannerRoutes from "./routes/banner.routes.js";
import orderRoutes from "./routes/order.routes.js"; 
import couponRoutes from "./routes/coupon.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);

// Security
app.use(helmet());

// CORS
app.use(
    cors({
        origin: [
            process.env.CLIENT_URL || "http://localhost:5173",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
        ],
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
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "E-Commerce Backend Running Successfully 🚀",
    });
});

export default app;