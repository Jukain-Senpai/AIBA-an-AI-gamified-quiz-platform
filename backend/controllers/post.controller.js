const prisma = require("../utils/prisma");
const { canManageContent, canAccessPost, isAdminRole } = require("../utils/access");
const { detectProhibitedLanguage, moderateContent } = require("../services/moderation.service");

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
            tags: tags || [],
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
                tags: tags || [],
                moderationStatus: moderation.flagged ? "PENDING" : "APPROVED",
                moderationReason: moderation.reason || null,
                moderatedAt: new Date(),
                authorId: req.user.id,
            },
            include: {
                author: {
                    select: { id: true, username: true, avatar: true, title: true },
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
        const { category, search } = req.query;
        let where = {};

        if (category) {
            where.category = category;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
            ];
        }

        const posts = await prisma.post.findMany({
            where: isAdminRole(req.user?.role)
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
                },
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                category: true,
                tags: true,
                upvotes: true,
                createdAt: true,
                updatedAt: true,
                moderationStatus: true,
                moderationReason: true,
                moderatedAt: true,
                author: {
                    select: { id: true, username: true, avatar: true, title: true },
                },
                _count: {
                    select: { comments: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const isAdmin = isAdminRole(req.user?.role);
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                category: true,
                tags: true,
                upvotes: true,
                createdAt: true,
                updatedAt: true,
                moderationStatus: true,
                moderationReason: true,
                moderatedAt: true,
                authorId: true,
                author: {
                    select: { id: true, username: true, avatar: true, title: true },
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
                    include: {
                        author: {
                            select: { id: true, username: true, avatar: true, title: true },
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

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!canManageContent(req.user, post.authorId)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await prisma.post.delete({ where: { id: Number(id) } });
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
