import express from "express";
import {
    createReview,
    getReviewsBySlug,
    checkReviewEligibility,
} from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: get reviews for a product
router.get("/:slug", getReviewsBySlug);

// Protected: check if user can review
router.get("/:slug/eligibility", protect, checkReviewEligibility);

// Protected: post a review
router.post("/", protect, createReview);

export default router;
