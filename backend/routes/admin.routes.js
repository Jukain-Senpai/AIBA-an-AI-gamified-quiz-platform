const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const { isAdminRole, isStaffRole } = require("../utils/access");
const { 
    getAdminContent, 
    updateModerationStatus, 
    bulkModerateContent, 
    getModerationLogs,
    getDashboardOverview,
    getUsersList,
    updateUserStatus,
    deleteUser,
    resetUserPasswordAdmin
} = require("../controllers/admin.controller");

const requireAdmin = (req, res, next) => {
    if (!isAdminRole(req.user?.role)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    next();
};

const requireStaff = (req, res, next) => {
    if (!isStaffRole(req.user?.role)) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    next();
};

// Staff routes (admin + mod) — content moderation & logs
router.get("/content", protect, requireStaff, getAdminContent);
router.patch("/content/:type/:id", protect, requireStaff, updateModerationStatus);
router.post("/content/bulk-moderate", protect, requireStaff, bulkModerateContent);
router.get("/logs", protect, requireStaff, getModerationLogs);

// Admin-only routes — dashboard & user management
router.get("/overview", protect, requireAdmin, getDashboardOverview);
router.get("/users", protect, requireAdmin, getUsersList);
router.patch("/users/:id", protect, requireAdmin, updateUserStatus);
router.delete("/users/:id", protect, requireAdmin, deleteUser);
router.post("/users/:id/reset-password", protect, requireAdmin, resetUserPasswordAdmin);

module.exports = router;
