import slugify from "slugify";
import Category from "../models/category.model.js";

/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required.",
            });
        }

        const exists = await Category.findOne({ name });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Category already exists.",
            });
        }

        const category = await Category.create({
            name,
            slug: slugify(name, {
                lower: true,
                strict: true,
            }),
            description,
            image: req.file ? req.file.filename : "",
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category,
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
| Get All Categories
|--------------------------------------------------------------------------
*/

export const getCategories = async (req, res) => {
    try {

        const categories = await Category.find().sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: categories.length,
            categories,
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
| Get Single Category
|--------------------------------------------------------------------------
*/

export const getCategory = async (req, res) => {
    try {

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        return res.status(200).json({
            success: true,
            category,
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
| Update Category
|--------------------------------------------------------------------------
*/

export const updateCategory = async (req, res) => {
    try {

        const { name, description, isActive } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        if (name) {
            category.name = name;
            category.slug = slugify(name, {
                lower: true,
                strict: true,
            });
        }

        if (description !== undefined) {
            category.description = description;
        }

        if (isActive !== undefined) {
            category.isActive = isActive;
        }

        if (req.file) {
            category.image = req.file.filename;
        }

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully.",
            category,
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
| Delete Category
|--------------------------------------------------------------------------
*/

export const deleteCategory = async (req, res) => {
    try {

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        await category.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};