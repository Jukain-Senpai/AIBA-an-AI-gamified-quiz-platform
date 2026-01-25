const express = require("express");
const router = express.Router({ mergeParams: true });

const { createQuestion } = require("../controllers/question.controller");
const protect = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/quizzes/{quizId}/questions:
 *   post:
 *     summary: Add question to quiz
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Question created
 */

router.post("/", protect, createQuestion);
module.exports = router;