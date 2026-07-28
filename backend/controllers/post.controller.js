const prisma = require("../utils/prisma");
const { canManageContent, canAccessPost, isStaffRole } = require("../utils/access");
const { detectProhibitedLanguage, moderateContent } = require("../services/moderation.service");
const { createNotification } = require("../services/notification.service");

const createPost = async (req, res) => {
    try {
        const { title, content, category, tags, image } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const moderationPayload = {
            title,
            content,
            category: category || "General",
        };
        const profanityCheck = detectProhibitedLanguage(moderationPayload);
        if (profanityCheck.blocked) {
            return res.status(400).json({ message: profanityCheck.reason });
        }

        const moderation = await moderateContent("post", moderationPayload);

        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                image: image || null,
                category,
                moderationStatus: moderation.flagged ? "PENDING" : "APPROVED",
                moderationReason: moderation.reason || null,
                moderatedAt: new Date(),
                authorId: req.user.id,
            },
        include: {
            author: {
                select: { id: true, username: true, avatar: true, title: true, role: true },
            },
        },
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create post" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const { category, search, sortBy, page = 1, limit = 10 } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const skip = (pageNum - 1) * limitNum;

        let where = {};

        if (category && category !== 'All') {
            where.category = category;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
            ];
        }

        const finalWhere = isStaffRole(req.user?.role)
            ? where
            : {
                AND: [
                    where,
                    {
                        OR: [
                            { moderationStatus: "APPROVED" },
                            { authorId: req.user.id },
                        ],
                    },
                ],
            };

        let orderBy = [];
        if (sortBy === 'newest') {
            orderBy = [{ createdAt: "desc" }];
        } else {
            orderBy = [{ upvotes: "desc" }, { createdAt: "desc" }];
        }

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: finalWhere,
                select: {
                    id: true,
                    title: true,
                    content: true,
                    image: true,
                    category: true,
                    upvotes: true,
                    createdAt: true,
                    updatedAt: true,
                    moderationStatus: true,
                    moderationReason: true,
                    moderatedAt: true,
                author: {
                    select: { id: true, username: true, avatar: true, title: true, level: true, role: true },
                },
                    _count: {
                        select: { comments: true },
                    },
                },
                orderBy,
                skip,
                take: limitNum,
            }),
            prisma.post.count({ where: finalWhere })
        ]);

        res.status(200).json({
            items: posts,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum) || 1
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const isAdmin = isStaffRole(req.user?.role);
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                category: true,
                upvotes: true,
                createdAt: true,
                updatedAt: true,
                moderationStatus: true,
                moderationReason: true,
                moderatedAt: true,
                authorId: true,
                author: {
                    select: { id: true, username: true, avatar: true, title: true, role: true },
                },
                comments: {
                    where: isAdmin
                        ? {}
                        : {
                            OR: [
                                { moderationStatus: "APPROVED" },
                                { authorId: req.user.id },
                            ],
                        },
                    select: {
                        id: true,
                        content: true,
                        image: true,
                        upvotes: true,
                        moderationStatus: true,
                        moderationReason: true,
                        moderatedAt: true,
                        createdAt: true,
                        updatedAt: true,
                        authorId: true,
                        postId: true,
                        parentCommentId: true,
            author: {
                    select: { id: true, username: true, avatar: true, title: true, level: true, role: true },
                },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                _count: {
                    select: { postLikes: true },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!canAccessPost(req.user, post)) {
            return res.status(403).json({ message: "This post is not available" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch post" });
    }
};

const toggleUpvotePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const postId = Number(id);

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                id: true,
                authorId: true,
                moderationStatus: true,
            },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!canAccessPost(req.user, post)) {
            return res.status(403).json({ message: "This post is not available" });
        }

        const existingLike = await prisma.postLike.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        if (existingLike) {
            await prisma.postLike.delete({
                where: { id: existingLike.id },
            });
            await prisma.post.update({
                where: { id: postId },
                data: { upvotes: { decrement: 1 } },
            });
            return res.status(200).json({ message: "Upvote removed", liked: false });
        }

        await prisma.postLike.create({
            data: { userId, postId },
        });
        await prisma.post.update({
            where: { id: postId },
            data: { upvotes: { increment: 1 } },
        });
        return res.status(200).json({ message: "Upvoted", liked: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to toggle upvote" });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({ where: { id: Number(id) } });
        const postOwner = await prisma.post.findUnique({
            where: { id: Number(id) },
            select: { id: true, authorId: true },
        });

        if (!postOwner) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!canManageContent(req.user, postOwner.authorId)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const isAdminDeleted = String(req.user?.role || "").toLowerCase() === "admin" && postOwner.authorId !== req.user.id;
        await prisma.post.delete({ where: { id: Number(id) } });
        if (isAdminDeleted) {
            await createNotification({
                recipientId: postOwner.authorId,
                actorId: req.user.id,
                type: "content_deleted",
                title: "Your post was deleted",
                message: "An admin deleted one of your forum posts.",
                link: "/forum",
                targetType: "post",
                targetId: Number(id),
            });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete post" });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    toggleUpvotePost,
    deletePost,
};
