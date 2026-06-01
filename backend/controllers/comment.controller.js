const prisma = require("../utils/prisma");

const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const postExists = await prisma.post.findUnique({ where: { id: Number(postId) } });
        if (!postExists) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                postId: Number(postId),
                authorId: req.user.id
            },
            include: {
                author: {
                    select: { id: true, username: true, avatar: true, title: true }
                }
            }
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add comment" });
    }
};

const toggleUpvoteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const commentId = Number(id);

        const existingLike = await prisma.commentLike.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId
                }
            }
        });

        if (existingLike) {
            await prisma.commentLike.delete({
                where: { id: existingLike.id }
            });
            await prisma.comment.update({
                where: { id: commentId },
                data: { upvotes: { decrement: 1 } }
            });
            return res.status(200).json({ message: "Upvote removed", liked: false });
        } else {
            await prisma.commentLike.create({
                data: { userId, commentId }
            });
            await prisma.comment.update({
                where: { id: commentId },
                data: { upvotes: { increment: 1 } }
            });
            return res.status(200).json({ message: "Upvoted", liked: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to toggle upvote" });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await prisma.comment.findUnique({ where: { id: Number(id) } });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.authorId !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await prisma.comment.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete comment" });
    }
};

module.exports = {
    createComment,
    toggleUpvoteComment,
    deleteComment
};
