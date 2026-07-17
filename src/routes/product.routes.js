import express from "express";
import {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";

import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
    "/",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 10 },
    ]),
    createProduct
);

router.get("/", getProducts);
router.get("/:id", getProduct);

router.put(
    "/:id",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 10 },
    ]),
    updateProduct
);

router.delete("/:id", deleteProduct);

export default router;