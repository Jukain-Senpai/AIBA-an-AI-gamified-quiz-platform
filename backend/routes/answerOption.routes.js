const express = require("express");
const router = express.Router();

const { createAnswerOption } = require("../controllers/answerOption.controller");
const protect = require("../middleware/auth.middleware");
/**
 * @swagger
 * /api/questions/{questionId}/options:
 *   post:
 *    summary: Create a new answer option for a question
 *    tags: [AnswerOption]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: questionId
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *           type: object
 *           required: 
 *            - text
 *           properties:
 *            text:
 *             type: string
 *            isCorrect:
 *             type: boolean
 *    responses:
 *     201:
 *      description: Answer option created
 *     401:
 *      description: Unauthorized
 */

router.post("/questions/:questionId/options", protect, createAnswerOption);

module.exports = router;