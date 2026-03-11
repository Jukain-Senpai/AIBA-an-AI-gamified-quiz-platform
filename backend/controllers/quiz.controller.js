const prisma = require("../utils/prisma");


const createQuiz = async (req, res) => { 
    console.log("REQ.USER =", req.user);

    try {
        const { title, description } = req.body;

        if(!title) {
            return res.status(400).json({ message: "Title is required"});
        }

        const quiz = await prisma.quiz.create({
            data: {
                title,
                description,
                creatorId: req.user.id,            
            },
        });

        res.status(201).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create quiz" });
    }
};

const getQuizById = async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await prisma.quiz.findUnique({
            where: { id: Number(quizId) },
            include: {
                questions: {
                    orderBy: { order: "asc" },
                    include: {
                        options: {
                            select: {
                                id: true,
                                text: true,
                            }
                        }
                    }
                }
            }
        });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch quiz" });
    }
};

const checkAnswer = async (req, res) => {
    try {
        const { optionId } = req.body;

        if (!optionId) {
            return res.status(400).json({ message: "optionId is required" });
        }

        const option = await prisma.answerOption.findUnique({
            where: { id: Number(optionId) },
            include: {
                question: {
                    include: {
                        options: {
                            where: { isCorrect: true },
                            select: { id: true}
                        }
                    }
                }
            }
        });

        if (!option) {
            return res.status(404).json({ message: "Option not found" });
        }

        const correctOptionId = option.question.options[0].id;

        const isCorrect = option.isCorrect;

        res.status(200).json({
            correct: isCorrect,
            correctOptionId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to check answer" });
    }
};

const getAllQuizzes = async(req, res) => {
    try {

        const quizzes = await prisma.quiz.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                creator: {
                    select: {
                        id: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        questions: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
        });
        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch quizzes" });
    }
};

module.exports = {
    createQuiz,
    getQuizById,
    getAllQuizzes,
    checkAnswer
};