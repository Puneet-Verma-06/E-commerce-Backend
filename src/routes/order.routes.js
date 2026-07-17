import express from "express";
import {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder,
} from "../controllers/order.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/", protect, getOrders);

router.get("/:id", protect, getOrder);

router.put("/:id", protect, updateOrder);

router.delete("/:id", protect, deleteOrder);

export default router;