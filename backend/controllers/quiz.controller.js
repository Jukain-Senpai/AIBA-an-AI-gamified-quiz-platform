
const prisma = require("../utils/prisma");


const createQuiz = async (req, res) => { 
    console.log("REQ.USER =", req.user);

    try {
        const { quiz,questions } = req.body;
        const { title, description } = quiz;

        if(!title) {
            return res.status(400).json({ message: "Title is required"});
        }

        const newQuiz = await prisma.quiz.create({
            data: {
                title,
                description,
                creatorId: req.user.id,
                
                questions: {
                    create: questions
                    .filter(q => q.text && q.text.trim() !== "")
                    .map((q,index) => ({
                        text:q.text,
                        order:index + 1,

                        options: {
                            create: q.answers
                            .filter(a => a.trim() !== "")
                            .map((answer, i) => ({
                                text: answer,
                                isCorrect: q.correctIndex === i
                            }))
                        }
                    }))
                }
            },
        });

        res.status(201).json(newQuiz);
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

const useSkill = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { skillName } = req.body;

        const question = await prisma.question.findUnique({
            where: { id: Number(questionId) },
            include: { options: true }
        });

        if (!question) return res.status(404).json({ message: "Question not found" });

        const correctOption = question.options.find(o => o.isCorrect);
        const incorrectOptions = question.options.filter(o => !o.isCorrect);

        let data = {};

        if (skillName === "Battle Fury") {
            const shuffled = incorrectOptions.sort(() => 0.5 - Math.random());
            data.removedOptionIds = [shuffled[0].id, shuffled[1].id];
        } else if (skillName === "Incantation") {
            const shuffled = incorrectOptions.sort(() => 0.5 - Math.random());
            data.removedOptionIds = [shuffled[0].id];
        } else if (skillName === "Arcane Knowledge" || skillName === "Crowd Mentality") {
            data.correctOptionId = correctOption.id;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to use skill" });
    }
};

module.exports = {
    createQuiz,
    getQuizById,
    getAllQuizzes,
    checkAnswer,
    useSkill
};