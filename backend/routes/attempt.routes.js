const express = require("express");
const router = express.Router({ mergeParams: true });

const { submitQuizAttempt } = require("../controllers/attempt.controller");
const protect = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/quizzes/{quizId}/attempts:
 *   post:
 *     summary: Submit a quiz attempt
 *     tags: [Attempt]
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
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                     selectedOptionId:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Attempt submitted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

router.post("/", protect, submitQuizAttempt);
module.exports = router;