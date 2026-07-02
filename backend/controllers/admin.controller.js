const prisma = require("../utils/prisma");
const { isAdminRole } = require("../utils/access");

const modelMap = {
    quiz: {
        model: prisma.quiz,
        idField: "id",
    },
    post: {
        model: prisma.post,
        idField: "id",
    },
    comment: {
        model: prisma.comment,
        idField: "id",
    },
};

const getAdminContent = async (req, res) => {
    try {
        if (!isAdminRole(req.user?.role)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const [quizzes, posts, comments] = await Promise.all([
            prisma.quiz.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    thumbnail: true,
                    category: true,
                    difficulty: true,
                    isPublished: true,
                    moderationStatus: true,
                    moderationReason: true,
                    moderatedAt: true,
                    createdAt: true,
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: {
                            questions: true,
                            attempts: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.post.findMany({
                select: {
                    id: true,
                    title: true,
                    content: true,
                    image: true,
                    category: true,
                    tags: true,
                    upvotes: true,
                    moderationStatus: true,
                    moderationReason: true,
                    moderatedAt: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: {
                            comments: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.comment.findMany({
                select: {
                    id: true,
                    content: true,
                    image: true,
                    upvotes: true,
                    moderationStatus: true,
                    moderationReason: true,
                    moderatedAt: true,
                    createdAt: true,
                    author: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        },
                    },
                    post: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
        ]);

        res.json({
            quizzes,
            posts,
            comments,
        });
    } catch (error) {
        console.error("Admin content error:", error);
        res.status(500).json({ message: "Failed to fetch admin content" });
    }
};

const updateModerationStatus = async (req, res) => {
    try {
        if (!isAdminRole(req.user?.role)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { type, id } = req.params;
        const { moderationStatus, moderationReason } = req.body;

        if (!modelMap[type]) {
            return res.status(400).json({ message: "Invalid moderation type" });
        }

        const normalizedStatus = String(moderationStatus || "").trim().toUpperCase();
        if (!["PENDING", "APPROVED", "REJECTED"].includes(normalizedStatus)) {
            return res.status(400).json({ message: "Invalid moderation status" });
        }

        const updated = await modelMap[type].model.update({
            where: { [modelMap[type].idField]: Number(id) },
            data: {
                moderationStatus: normalizedStatus,
                moderationReason: moderationReason || null,
                moderatedAt: new Date(),
            },
        });

        res.json({ message: "Moderation status updated", item: updated });
    } catch (error) {
        console.error("Moderation update error:", error);
        res.status(500).json({ message: "Failed to update moderation status" });
    }
};

module.exports = {
    getAdminContent,
    updateModerationStatus,
};
