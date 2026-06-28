const prisma = require("../utils/prisma");
const { canAccessQuiz } = require("../utils/access");

const submitQuizAttempt = async (req, res) => {
    try {
        const userId = req.user.id;
        const quizId = Number(req.params.quizId);
        const { answers } = req.body;

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: "Answers are required" });
        }

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            select: {
                id: true,
                creatorId: true,
                isPublished: true,
            },
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (!canAccessQuiz(req.user, quiz)) {
            return res.status(403).json({ message: "This quiz is private" });
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

        let user = await prisma.user.findUnique({
            where: { id: userId }
        });

        // Streak logic: "consecutive quizzes passed"
        const passed = score >= (totalQuestions / 2);
        let winStreak = user.winStreak || 0;

        if (passed) {
            winStreak += 1;
        } else {
            winStreak = 0;
        }

        // Calculate XP breakdown
        const baseXP = score * 10;
        const completionXP = 20;
        const streakBonusXP = winStreak > 1 ? (winStreak * 5) : 0;
        const xpEarned = baseXP + completionXP + streakBonusXP;

        // Update attempt
        await prisma.attempt.update({
            where: { id: attempt.id },
            data: {
                score,
                completedAt: new Date(),
            },
        });

        // Level up logic
        let xp = (user.xp || 0) + xpEarned;
        let level = user.level || 1;
        let skillPoints = user.skillPoints || 0;
        let leveledUp = false;
        
        let xpToNext = level * 100;

        while (xp >= xpToNext) {
            xp -= xpToNext;
            level += 1;
            skillPoints += 1;
            leveledUp = true;
            xpToNext = level * 100;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                xp,
                level,
                skillPoints,
                winStreak
            }
        });

        res.status(201).json({
            attemptId: attempt.id,
            score,
            totalQuestions,
            xpEarned,
            baseXP,
            completionXP,
            streakBonusXP,
            level: updatedUser.level,
            currentXp: updatedUser.xp,
            skillPoints: updatedUser.skillPoints,
            winStreak: updatedUser.winStreak,
            leveledUp
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to submit quiz attempt", error: error.message, stack: error.stack });
    }
};

module.exports = { submitQuizAttempt };
