import express from "express";
import {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
} from "../controllers/coupon.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createCoupon);

router.get("/", getCoupons);

router.get("/:id", getCoupon);

router.put("/:id", protect, updateCoupon);

router.delete("/:id", protect, deleteCoupon);

export default router;