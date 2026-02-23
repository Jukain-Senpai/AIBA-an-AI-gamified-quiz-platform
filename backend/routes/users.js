const express = require(express);
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authMiddleware = require("../middleware/auth.middleware");
const { attempt } = require("../utils/prisma");

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                attempts: true,
            },
        });

        const quizzesCompleted = user.attempts.length;

        res.json({
            level: user.level,
            xp: user.xp,
            xpToNext: user.level *1000,
            title: user.title,
            path: user.path,
            avatar: user.avatar,
            stats: {
                quizzesCompleted,
                winStreak: 0,
                skillPoints: Math.floor(user.level / 2),
            },
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user data " });
    }
});
module.exports = router;