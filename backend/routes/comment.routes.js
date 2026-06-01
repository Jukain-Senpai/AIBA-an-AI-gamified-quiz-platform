const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");

const {
    createComment,
    toggleUpvoteComment,
    deleteComment
} = require("../controllers/comment.controller");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Forum post comments
 */

/**
 * @swagger
 * /api/comments/post/{postId}:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Content is required
 *       404:
 *         description: Post not found
 */
router.post("/post/:postId", protect, createComment);

/**
 * @swagger
 * /api/comments/{id}/upvote:
 *   post:
 *     summary: Toggle upvote on a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Upvote toggled (liked or removed)
 *       401:
 *         description: Unauthorized
 */
router.post("/:id/upvote", protect, toggleUpvoteComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment (author or admin only)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Unauthorized (not the author or admin)
 *       404:
 *         description: Comment not found
 */
router.delete("/:id", protect, deleteComment);

module.exports = router;
