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

module.exports = {
    createQuiz,
};