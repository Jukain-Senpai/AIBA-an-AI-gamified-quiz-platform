const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const { isAdminRole } = require("../utils/access");
const { getAdminContent, updateModerationStatus } = require("../controllers/admin.controller");

const requireAdmin = (req, res, next) => {
    if (!isAdminRole(req.user?.role)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    next();
};

router.get("/content", protect, requireAdmin, getAdminContent);
router.patch("/content/:type/:id", protect, requireAdmin, updateModerationStatus);

module.exports = router;
