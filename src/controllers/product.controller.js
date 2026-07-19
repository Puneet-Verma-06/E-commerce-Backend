import Product from "../models/product.model.js";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

/**
 * Convert a filesystem path to a URL-friendly /uploads/... path.
 * On Vercel files land in /tmp/uploads/...; locally in <root>/uploads/...
 */
function toUrlPath(fsPath) {
    // Normalise to forward slashes
    const p = fsPath.replace(/\\/g, "/");
    const marker = "/uploads/";
    const idx = p.indexOf(marker);
    return idx !== -1 ? p.slice(idx) : `/${p}`;
}

/**
 * FormData sends booleans as the strings "true" / "false".
 * Cast them back to proper JS booleans before saving.
 */
function castBooleans(data) {
    const boolFields = ["featured", "isActive"];
    boolFields.forEach((key) => {
        if (data[key] !== undefined) {
            if (data[key] === "true" || data[key] === true) data[key] = true;
            else if (data[key] === "false" || data[key] === false) data[key] = false;
        }
    });
    return data;
}

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export const createProduct = async (req, res) => {
    try {
        const data = castBooleans({ ...req.body });

        if (req.files?.thumbnail) {
            data.thumbnail = toUrlPath(req.files.thumbnail[0].path);
        }

        if (req.files?.images) {
            data.images = req.files.images.map((file) => toUrlPath(file.path));
        }

        const product = await Product.create(data);

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product,
        });
    } catch (error) {
        console.error("createProduct error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Get All Products
|--------------------------------------------------------------------------
*/

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "name slug")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
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
| Get Single Product
|--------------------------------------------------------------------------
*/

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            "category",
            "name slug"
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            product,
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
| Update Product
|--------------------------------------------------------------------------
*/

export const updateProduct = async (req, res) => {
    try {
        const updateData = castBooleans({ ...req.body });

        if (req.files?.thumbnail) {
            updateData.thumbnail = toUrlPath(req.files.thumbnail[0].path);
        }

        if (req.files?.images) {
            updateData.images = req.files.images.map((file) => toUrlPath(file.path));
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).populate("category", "name slug");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product,
        });
    } catch (error) {
        console.error("updateProduct error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        await product.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};