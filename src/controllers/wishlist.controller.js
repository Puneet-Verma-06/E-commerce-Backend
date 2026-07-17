import Wishlist from "../models/wishlist.model.js";

/*
|--------------------------------------------------------------------------
| Add To Wishlist
|--------------------------------------------------------------------------
*/

export const addToWishlist = async (req, res) => {
    try {
        const { product } = req.body;

        const user = req.user._id;

        const exists = await Wishlist.findOne({ user, product });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist.",
            });
        }

        const wishlist = await Wishlist.create({
            user,
            product,
        });

        return res.status(201).json({
            success: true,
            message: "Added to wishlist.",
            wishlist,
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
| Get Wishlist
|--------------------------------------------------------------------------
*/

export const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({
            user: req.user._id,
        }).populate("product");

        return res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist,
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
| Remove From Wishlist
|--------------------------------------------------------------------------
*/

export const removeFromWishlist = async (req, res) => {
    try {

        const item = await Wishlist.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Wishlist item not found.",
            });
        }

        await item.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Removed from wishlist.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};