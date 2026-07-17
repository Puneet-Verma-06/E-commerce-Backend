import express from "express";
import {
    createBanner,
    getBanners,
    updateBanner,
    deleteBanner,
} from "../controllers/banner.controller.js";

import upload from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    upload.single("image"),
    createBanner
);

router.get("/", getBanners);

router.put(
    "/:id",
    protect,
    upload.single("image"),
    updateBanner
);

router.delete("/:id", protect, deleteBanner);

export default router;