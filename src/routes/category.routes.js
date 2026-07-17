import express from "express";
import {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Category Routes
|--------------------------------------------------------------------------
*/

router.post("/", protect, createCategory);

router.get("/", getCategories);

router.get("/:id", getCategory);

router.put("/:id", protect, updateCategory);

router.delete("/:id", protect, deleteCategory);

export default router;