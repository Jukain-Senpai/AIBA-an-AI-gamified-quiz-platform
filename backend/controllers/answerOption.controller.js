const prisma = require("../utils/prisma");

const createAnswerOption = async (req, res) => {
    try {
        const { text, isCorrect } = req.body;
        const { questionId } = req.params;

        if (!text) {
            return res.status(400).json({ message: "Option text is required"});
            
        }

        if (isCorrect) {
            const existingCorrect = await prisma.answerOption.findFirst({
                where: {
                    questionId: Number(questionId),
                    isCorrect: true,
                },
            });

            if (existingCorrect) {
                return res.status(400).json({
                    message: "This question already has a correct answer",

                });
            }
        }

        const options = await prisma.answerOption.create({
            data: {
                text,
                isCorrect: Boolean(isCorrect),
                questionId: Number(questionId),
            },
        });

        res.status(201).json(options);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create answer option"})
    }
};

module.exports = {
    createAnswerOption,
};