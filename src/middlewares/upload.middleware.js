import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Vercel the filesystem is read-only except /tmp.
// Locally we write to <server-root>/uploads.
const getBaseDir = () => {
    if (process.env.VERCEL) {
        return "/tmp/uploads";
    }
    return path.join(__dirname, "../../uploads");
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const baseDir = getBaseDir();

        const subfolder = req.baseUrl.includes("products")
            ? "products"
            : req.baseUrl.includes("categories")
            ? "categories"
            : req.baseUrl.includes("banners")
            ? "banners"
            : "users";

        const folder = path.join(baseDir, subfolder);

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