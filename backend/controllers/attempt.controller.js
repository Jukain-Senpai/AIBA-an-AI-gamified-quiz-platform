const prisma = require("../utils/prisma");

const submitQuizAttempt = async (req, res) => {
    try {
        const userId = req.user.id;
        const quizId = Number(req.params.quizId);
        const { answers } = req.body;

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: "Answer are required" });   
        }
// Create attempt
        const attempt = await prisma.attempt.create({
            data: {
                userId,
                quizId,
            },
        });
// Save answers
        await prisma.attemptAnswer.createMany({
            data: answers.map((a) => ({
                attemptId: attempt.id,
                selectedOptionId: a.selectedOptionId,
            })),
        });
// Fetch correct answers
        const correctOptions = await prisma.answerOption.findMany({
            where: {
                isCorrect: true,
                question: {
                    quizId,
                },
            },
            select: { id:true },
        });

        const correctOptionIds = new Set(
            correctOptions.map((opt) => opt.id)
        );
// Calculate score
        let score = 0;
        for (const answer of answers) {
            if (correctOptionIds.has(answer.selectedOptionId)) {
                score ++;
            }
        }
// Update attempt
        const updatedAttempt = await prisma.attempt.update({
            where: { id:attempt.id },
            data: {
                score,
                completedAt: new Date(),
            },
        });

        res.status(201).json({
            attemptId: updatedAttempt.id,
            score,
            totalQuestions: correctOptions.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to submit quiz attempt" });
    }
};

module.exports = { submitQuizAttempt };