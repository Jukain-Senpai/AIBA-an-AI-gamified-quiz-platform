const express = require("express");
const router = express.Router();

const { createQuiz } = require("../controllers/quiz.controller");
const protect = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quiz]
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quiz created
 *       401:
 *         description: Unauthorized
 */

router.post("/", protect, createQuiz);
module.exports = router;