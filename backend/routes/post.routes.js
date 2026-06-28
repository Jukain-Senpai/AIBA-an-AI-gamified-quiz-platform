const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");

const {
    createPost,
    getAllPosts,
    getPostById,
    toggleUpvotePost,
    deletePost
} = require("../controllers/post.controller");

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Community Hub forum posts
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter posts by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search posts by title or content
 *     responses:
 *       200:
 *         description: List of posts
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a single post with its comments
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post data with nested comments
 *       404:
 *         description: Post not found
 */
router.get("/:id", protect, getPostById);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Title and content are required
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createPost);

/**
 * @swagger
 * /api/posts/{id}/upvote:
 *   post:
 *     summary: Toggle upvote on a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Upvote toggled (liked or removed)
 *       401:
 *         description: Unauthorized
 */
router.post("/:id/upvote", protect, toggleUpvotePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post (author or admin only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Unauthorized (not the author or admin)
 *       404:
 *         description: Post not found
 */
router.delete("/:id", protect, deletePost);

module.exports = router;
