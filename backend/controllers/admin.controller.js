const prisma = require("../utils/prisma");
const { isAdminRole } = require("../utils/access");

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

module.exports = {
    getAdminContent,
};
