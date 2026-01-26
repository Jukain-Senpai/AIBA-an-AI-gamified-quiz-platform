const prisma = require("../utils/prisma");

const createAnswerOption = async (req, res) => {
    try {
        const { text, isCorrect } = req.body;
        const { questionId } = req.params;

        if (!text) {
            return res.status(400).json({ message: "Option text is required"});
            
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