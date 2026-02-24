const prisma = require("../utils/prisma");

const submitQuizAttempt = async (req, res) => {
    try {
        const userId = req.user.id;
        const quizId = Number(req.params.quizId);
        const { answers } = req.body;

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: "Answers are required" });
        }

        // Get total questions
        const totalQuestions = await prisma.question.count({
            where: { quizId },
        });

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

        // Get correct options
        const correctOptions = await prisma.answerOption.findMany({
            where: {
                isCorrect: true,
                question: { quizId },
            },
            select: { id: true },
        });

        const correctOptionIds = new Set(
            correctOptions.map((opt) => opt.id)
        );

        // Calculate score
        let score = 0;
        for (const answer of answers) {
            if (correctOptionIds.has(answer.selectedOptionId)) {
                score++;
            }
        }

        const xpEarned = score * 10;

        // Update attempt
        await prisma.attempt.update({
            where: { id: attempt.id },
            data: {
                score,
                completedAt: new Date(),
            },
        });


        // Update user XP
        await prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: xpEarned },
            },
        });

        let user = await prisma.user.findUnique({
            where: { id: userId }
        });

        let xp = user.xp;
        let level = user.level;
        
        let xpToNext = level *100;

        while (xp >= xpToNext) {
            xp -= xpToNext;
            level += 1;
            xpToNext = level * 100;
        }

        const updatedUser = await prisma.user.update({
            where: { id:userId },
            data: {
                xp,
                level
            }
        });

        res.status(201).json({
            attemptId: attempt.id,
            score,
            totalQuestions,
            xpEarned,
            level: updatedUser.level,
            currentXp: updatedUser.xp
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to submit quiz attempt" });
    }
};

module.exports = { submitQuizAttempt };