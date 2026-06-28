const prisma = require("../utils/prisma");

const createPost = async (req, res) => {
    try {
        const { title, content, category, tags, image } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                image: image || null,
                category,
                tags: tags || [],
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
            where,
            include: {
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

        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: {
                author: {
                    select: { id: true, username: true, avatar: true, title: true },
                },
                comments: {
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

        if (post.authorId !== req.user.id && req.user.role !== "ADMIN") {
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
