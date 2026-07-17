import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.baseUrl.includes("products")
    ? "uploads/products"
    : req.baseUrl.includes("categories")
    ? "uploads/categories"
    : req.baseUrl.includes("banners")
    ? "uploads/banners"
    : "uploads/users";

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;

    const isValid =
        allowed.test(path.extname(file.originalname).toLowerCase()) &&
        allowed.test(file.mimetype);

    if (isValid) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG and WEBP images are allowed."));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default upload;