const prisma = require("../utils/prisma");
const { canManageContent, canAccessPost, canAccessComment } = require("../utils/access");
const { detectProhibitedLanguage, moderateContent } = require("../services/moderation.service");
const { createNotification } = require("../services/notification.service");

const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, image, parentCommentId } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const postExists = await prisma.post.findUnique({
            where: { id: Number(postId) },
            select: {
                id: true,
                authorId: true,
                moderationStatus: true,
            },
        });
        if (!postExists) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!canAccessPost(req.user, postExists)) {
            return res.status(403).json({ message: "This post is not available" });
        }

        let parentComment = null;
        if (parentCommentId) {
            parentComment = await prisma.comment.findUnique({
                where: { id: Number(parentCommentId) },
                select: { id: true, authorId: true, postId: true, moderationStatus: true },
            });

            if (!parentComment || parentComment.postId !== Number(postId)) {
                return res.status(400).json({ message: "Parent comment is invalid" });
            }

            if (!canAccessComment(req.user, parentComment)) {
                return res.status(403).json({ message: "This parent comment is not available" });
            }
        }

        const moderationPayload = {
            content,
            postId: Number(postId),
        };
        const profanityCheck = detectProhibitedLanguage(moderationPayload);
        if (profanityCheck.blocked) {
            return res.status(400).json({ message: profanityCheck.reason });
        }

        const moderation = await moderateContent("comment", moderationPayload);

        const newComment = await prisma.comment.create({
            data: {
                content,
                image: image || null,
                postId: Number(postId),
                parentCommentId: parentComment ? parentComment.id : null,
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

        const notificationTarget = parentComment?.authorId || postExists.authorId;
        const notificationType = parentComment ? "comment_reply" : "post_comment";
        const notificationTitle = parentComment ? "Someone replied to your comment" : "New reply on your post";
        const notificationMessage = parentComment
            ? `${req.user.username || "Someone"} replied to your comment.`
            : `${req.user.username || "Someone"} replied to your post.`;
        const notificationLink = `/forum/post/${postId}`;

        if (notificationTarget && notificationTarget !== req.user.id && moderation.flagged !== true) {
            await createNotification({
                recipientId: notificationTarget,
                actorId: req.user.id,
                type: notificationType,
                title: notificationTitle,
                message: notificationMessage,
                link: notificationLink,
                targetType: "comment",
                targetId: newComment.id,
            });
        }

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

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: {
                id: true,
                authorId: true,
                postId: true,
                moderationStatus: true,
            },
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (!canAccessComment(req.user, comment)) {
            return res.status(403).json({ message: "This comment is not available" });
        }

        const existingLike = await prisma.commentLike.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });

        if (existingLike) {
            await prisma.commentLike.delete({
                where: { id: existingLike.id },
            });
            await prisma.comment.update({
                where: { id: commentId },
                data: { upvotes: { decrement: 1 } },
            });
            return res.status(200).json({ message: "Upvote removed", liked: false });
        }

        await prisma.commentLike.create({
            data: { userId, commentId },
        });
        await prisma.comment.update({
            where: { id: commentId },
            data: { upvotes: { increment: 1 } },
        });
        return res.status(200).json({ message: "Upvoted", liked: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to toggle upvote" });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await prisma.comment.findUnique({
            where: { id: Number(id) },
            select: { id: true, authorId: true },
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (!canManageContent(req.user, comment.authorId)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const isAdminDeleted = String(req.user?.role || "").toLowerCase() === "admin" && comment.authorId !== req.user.id;
        await prisma.comment.delete({ where: { id: Number(id) } });
        if (isAdminDeleted) {
            await createNotification({
                recipientId: comment.authorId,
                actorId: req.user.id,
                type: "content_deleted",
                title: "Your comment was deleted",
                message: "An admin deleted one of your comments.",
                link: "/forum",
                targetType: "comment",
                targetId: Number(id),
            });
        }
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete comment" });
    }
};

module.exports = {
    createComment,
    toggleUpvoteComment,
    deleteComment,
};
