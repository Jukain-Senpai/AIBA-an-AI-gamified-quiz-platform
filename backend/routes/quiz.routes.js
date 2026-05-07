const express = require("express");
const router = express.Router();

const { 
    createQuiz,
    getQuizById,
    getAllQuizzes,
    checkAnswer,
    useSkill
 } = require("../controllers/quiz.controller");
const protect = require("../middleware/auth.middleware");
const questionRoutes = require("./question.routes");
const attemptRoutes = require("./attempt.routes");

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
/**
 * @swagger
 * /api/quizzes/{quizId}:
 *   get:
 *     summary: Get quiz with questions and options
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz data
 *       404:
 *         description: Quiz not found
 */

router.get("/", protect, getAllQuizzes);
/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of quizzes
 */

router.get("/:quizId", protect, getQuizById);

router.post("/check-answer", protect, checkAnswer);
router.post("/use-skill/:questionId", protect, useSkill);
/**
 * @swagger
 * /api/quizzes/check-answer:
 *   post:
 *     summary: Check if selected answer is correct
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
 *               - optionId
 *             properties:
 *               optionId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Result of the answer check
 *       400:
 *         description: optionId missing
 *       404:
 *         description: Option not found
 */

router.use("/:quizId/questions", questionRoutes);
router.use("/:quizId/attempts", attemptRoutes);

module.exports = router;