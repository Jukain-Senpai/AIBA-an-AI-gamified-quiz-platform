const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = require("../utils/prisma");
const authMiddleware = require("../middleware/auth.middleware");
const { attempt } = require("../utils/prisma");

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                attempts: {
                    orderBy: { startedAt: 'desc' },
                    take: 5,
                    include: { quiz: true }
                },
                skills: {
                    include: { skill: true }
                }
            },
        });

        const allAttemptsCount = await prisma.attempt.count({
            where: { userId: req.user.id }
        });

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            level: user.level,
            xp: user.xp,
            xpToNext: user.level * 1000,
            title: user.title,
            path: user.path,
            avatar: user.avatar,
            recentAttempts: user.attempts,
            unlockedSkills: user.skills.map(s => s.skill.name),
            stats: {
                quizzesCompleted: allAttemptsCount,
                winStreak: 0,
                skillPoints: Math.floor(user.level / 2),
            },
        });
    } catch (error) {
        console.error("Fetch user error:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

// Update Profile
router.put("/me", authMiddleware, async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;
        
        // Build update object dynamically based on what was provided
        const updateData = {};
        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email;
        if (avatar !== undefined) updateData.avatar = avatar;
        
        if (password && password.trim() !== "") {
            const bcrypt = require("bcryptjs");
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true
            }
        });

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update profile error:", error);
        
        // Handle unique constraint errors (e.g. username or email already taken)
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Username or email is already taken" });
        }
        
        res.status(500).json({ error: "Failed to update profile" });
    }
});
module.exports = router;