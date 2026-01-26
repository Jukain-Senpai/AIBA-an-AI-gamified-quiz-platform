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
}

module.exports = {
    createQuiz,
    getQuizById,
};