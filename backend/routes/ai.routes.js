const express = require("express");
const router = express.Router();
const { generateQuiz } = require("../controllers/ai.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI-powered feature endpoints
 */

/**
 * @swagger
 * /api/ai/generate-quiz:
 *   post:
 *     summary: Generate a complete quiz using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Create a 5-question quiz about JavaScript promises, medium difficulty."
 *     responses:
 *       200:
 *         description: Successfully generated quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *                 category:
 *                   type: string
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                       answers:
 *                         type: array
 *                         items:
 *                           type: string
 *                       correctIndex:
 *                         type: integer
 *       400:
 *         description: Missing prompt
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server or AI generation error
 */

// Require authentication to use AI generation
router.post("/generate-quiz", authMiddleware, generateQuiz);

module.exports = router;
