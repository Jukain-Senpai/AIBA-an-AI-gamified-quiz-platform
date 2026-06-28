const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { uploadImage, getScopeFolder, getUploadUrl } = require("../middleware/upload.middleware");

router.post("/image", protect, (req, res, next) => {
    uploadImage.single("image")(req, res, (error) => {
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        next();
    });
}, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
    }

    const scope = String(req.query.scope || req.body.scope || "general").trim();
    const scopeFolder = getScopeFolder(scope);
    const { url, fullUrl } = getUploadUrl(req, scopeFolder, req.file.filename);

    res.status(201).json({
        message: "Image uploaded successfully",
        scope,
        url,
        fullUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalName: req.file.originalname,
    });
});

module.exports = router;
