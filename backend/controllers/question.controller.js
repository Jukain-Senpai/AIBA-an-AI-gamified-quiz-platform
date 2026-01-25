const prisma = require("../utils/prisma");

const createQuestion = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { text, order } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Question text is required"});

        }

        const quiz = await prisma.quiz.findUnique({
            where: { id:Number(quizId) },
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found"});
        }

        if (quiz.creatorId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to modify this quiz"});
        }

        const question = await prisma.question.create({
            data: {
                text,
                order: order ?? 1,
                quizId: Number(quizId),
            },
        });

        res.status(201).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create question" });
    }
};

module.exports = { createQuestion };