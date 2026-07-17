import express from "express";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";
import { getAnalytics, getUsers, getUserOrders } from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, isAdmin);

router.get("/analytics", getAnalytics);
router.get("/users", getUsers);
router.get("/users/:userId/orders", getUserOrders);

export default router;
