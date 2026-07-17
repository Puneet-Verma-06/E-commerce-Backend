import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Order from "../models/order.model.js";

/*
|--------------------------------------------------------------------------
| Create / Post a Review
| Only allowed if the user has a Delivered order
|--------------------------------------------------------------------------
*/

export const createReview = async (req, res) => {
    try {
        const { productSlug, orderId, rating, title, comment } = req.body;
        const customerId = req.user._id;

        // Validate the order belongs to the user and is Delivered
        const order = await Order.findOne({
            _id: orderId,
            customer: customerId,
            orderStatus: "Delivered",
        });

        if (!order) {
            return res.status(403).json({
                success: false,
                message: "You can only review products from delivered orders.",
            });
        }

        // Check if review already exists for this order + product
        const existingReview = await Review.findOne({
            productSlug,
            customer: customerId,
            order: orderId,
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product.",
            });
        }

        const review = await Review.create({
            productSlug,
            customer: customerId,
            order: orderId,
            rating,
            title: title || "",
            comment,
            verified: true,
        });

        await review.populate("customer", "name");

        return res.status(201).json({
            success: true,
            message: "Review posted successfully!",
            review,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Get Reviews for a Product (by slug)
|--------------------------------------------------------------------------
*/

export const getReviewsBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const reviews = await Review.find({ productSlug: slug })
            .populate("customer", "name")
            .sort({ createdAt: -1 });

        const total = reviews.length;
        const avgRating =
            total > 0
                ? Math.round(
                      (reviews.reduce((sum, r) => sum + r.rating, 0) / total) *
                          10
                  ) / 10
                : 0;

        // Rating distribution
        const distribution = [5, 4, 3, 2, 1].map((star) => ({
            star,
            count: reviews.filter((r) => r.rating === star).length,
        }));

        return res.status(200).json({
            success: true,
            count: total,
            avgRating,
            distribution,
            reviews,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Check if user can review (has delivered order)
| Returns list of eligible order IDs
|--------------------------------------------------------------------------
*/

export const checkReviewEligibility = async (req, res) => {
    try {
        const { slug } = req.params;
        const customerId = req.user._id;

        // Get all delivered orders by this user
        const deliveredOrders = await Order.find({
            customer: customerId,
            orderStatus: "Delivered",
        });

        // Get already-reviewed orders for this product slug
        const existingReviews = await Review.find({
            productSlug: slug,
            customer: customerId,
        }).select("order");

        const reviewedOrderIds = existingReviews.map((r) =>
            r.order.toString()
        );

        // Eligible = delivered orders not yet reviewed for this slug
        const eligibleOrders = deliveredOrders.filter(
            (o) => !reviewedOrderIds.includes(o._id.toString())
        );

        return res.status(200).json({
            success: true,
            canReview: eligibleOrders.length > 0,
            eligibleOrders: eligibleOrders.map((o) => ({
                _id: o._id,
                createdAt: o.createdAt,
            })),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
