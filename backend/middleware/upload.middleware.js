const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const uploadRoot = path.join(__dirname, "..", "uploads");

const scopeFolderMap = {
    avatar: "avatars",
    "quiz-thumbnail": "quiz-thumbnails",
    quiz: "quiz-thumbnails",
    "quiz-question": "quiz-questions",
    question: "quiz-questions",
    "forum-post": "forum-posts",
    post: "forum-posts",
    "forum-comment": "forum-comments",
    comment: "forum-comments",
};

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function getScopeFolder(scope) {
    return scopeFolderMap[scope] || "general";
}

function getUploadUrl(req, scopeFolder, filename) {
    const relativePath = `/uploads/${scopeFolder.split(path.sep).join("/")}/${filename}`;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return {
        url: relativePath,
        fullUrl: `${baseUrl}${relativePath}`,
    };
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        try {
            const scope = String(req.query.scope || req.body?.scope || "general").trim();
            const scopeFolder = getScopeFolder(scope);
            const destination = path.join(uploadRoot, scopeFolder);
            ensureDir(destination);
            cb(null, destination);
        } catch (error) {
            cb(error);
        }
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname || "").toLowerCase();
        const safeExt = ext && ext.length <= 10 ? ext : "";
        const uniqueName = `${Date.now()}-${crypto.randomUUID()}${safeExt}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
        return cb(new Error("Only JPG, PNG, WEBP, and GIF images are allowed"));
    }

    cb(null, true);
};

const uploadImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = {
    uploadImage,
    uploadRoot,
    getScopeFolder,
    getUploadUrl,
};
