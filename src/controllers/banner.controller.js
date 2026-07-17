import Banner from "../models/banner.model.js";

/*
|--------------------------------------------------------------------------
| Create Banner
|--------------------------------------------------------------------------
*/

export const createBanner = async (req, res) => {
    try {

        const {
            title,
            subtitle,
            buttonText,
            buttonLink,
            displayOrder,
            isActive,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Banner image is required.",
            });
        }

        const banner = await Banner.create({
            title,
            subtitle,
            buttonText,
            buttonLink,
            displayOrder,
            isActive,
            image: `/uploads/banners/${req.file.filename}`,
        });

        return res.status(201).json({
            success: true,
            message: "Banner created successfully.",
            banner,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

/*
|--------------------------------------------------------------------------
| Get All Banners
|--------------------------------------------------------------------------
*/

export const getBanners = async (req, res) => {
    try {

        const banners = await Banner.find().sort({
            displayOrder: 1,
        });

        return res.status(200).json({
            success: true,
            count: banners.length,
            banners,
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
| Update Banner
|--------------------------------------------------------------------------
*/

export const updateBanner = async (req, res) => {
    try {

        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found.",
            });
        }

        Object.assign(banner, req.body);

        if (req.file) {
            banner.image = `/uploads/banners/${req.file.filename}`;
        }

        await banner.save();

        return res.status(200).json({
            success: true,
            message: "Banner updated successfully.",
            banner,
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
| Delete Banner
|--------------------------------------------------------------------------
*/

export const deleteBanner = async (req, res) => {
    try {

        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found.",
            });
        }

        await banner.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};