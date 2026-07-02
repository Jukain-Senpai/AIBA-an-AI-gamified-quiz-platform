const prisma = require("../utils/prisma");
const { canAccessQuiz, canManageContent, isAdminRole } = require("../utils/access");
const { detectProhibitedLanguage, moderateContent } = require("../services/moderation.service");

const buildQuizModerationPayload = (quiz, questions) => ({
    title: quiz?.title || "",
    description: quiz?.description || "",
    category: quiz?.category || "General",
    difficulty: quiz?.difficulty || "Easy",
    questions: Array.isArray(questions)
        ? questions.map((question) => ({
            text: question?.text || "",
            answers: Array.isArray(question?.answers) ? question.answers : [],
        }))
        : [],
});

const normalizeTimeLimit = (timeLimit) => {
    const parsed = Number(timeLimit);
    if (!Number.isFinite(parsed)) {
        return 30;
    }

    return Math.min(120, Math.max(10, Math.round(parsed)));
};

const createQuiz = async (req, res) => {
    try {
        const { quiz, questions } = req.body;
        const { title, description, thumbnail, isPublished, visibility, timeLimit } = quiz || {};

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const publishedState =
            typeof isPublished === "boolean"
                ? isPublished
                : visibility === "Private"
                    ? false
                    : true;
        const moderationPayload = buildQuizModerationPayload(quiz, questions);
        const profanityCheck = detectProhibitedLanguage(moderationPayload);
        if (profanityCheck.blocked) {
            return res.status(400).json({ message: profanityCheck.reason });
        }

        const moderation = await moderateContent("quiz", moderationPayload);
        const moderationStatus = moderation.flagged ? "PENDING" : "APPROVED";
        const normalizedTimeLimit = normalizeTimeLimit(timeLimit);

        const newQuiz = await prisma.quiz.create({
            data: {
                title,
                description,
                thumbnail: thumbnail || null,
                timeLimit: normalizedTimeLimit,
                isPublished: publishedState,
                moderationStatus,
                moderationReason: moderation.reason || null,
                moderatedAt: new Date(),
                creatorId: req.user.id,
                questions: {
                    create: (Array.isArray(questions) ? questions : [])
                        .filter((q) => q.text && q.text.trim() !== "")
                        .map((q, index) => ({
                            text: q.text,
                            order: index + 1,
                            image: q.image || null,
                            options: {
                                create: (Array.isArray(q.answers) ? q.answers : [])
                                    .filter((answer) => answer.trim() !== "")
                                    .map((answer, i) => ({
                                        text: answer,
                                        isCorrect: q.correctIndex === i,
                                    })),
                            },
                        })),
                },
            },
        });

        res.status(201).json(newQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create quiz" });
    }
};

const updateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const existingQuiz = await prisma.quiz.findUnique({
            where: { id: Number(quizId) },
            select: {
                id: true,
                creatorId: true,
            },
        });

        if (!existingQuiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (!canManageContent(req.user, existingQuiz.creatorId)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const { quiz, questions } = req.body;
        const { title, description, thumbnail, isPublished, visibility, timeLimit } = quiz || {};

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const publishedState =
            typeof isPublished === "boolean"
                ? isPublished
                : visibility === "Private"
                    ? false
                    : true;
        const moderationPayload = buildQuizModerationPayload(quiz, questions);
        const profanityCheck = detectProhibitedLanguage(moderationPayload);
        if (profanityCheck.blocked) {
            return res.status(400).json({ message: profanityCheck.reason });
        }

        const moderation = await moderateContent("quiz", moderationPayload);
        const moderationStatus = moderation.flagged ? "PENDING" : "APPROVED";
        const normalizedTimeLimit = normalizeTimeLimit(timeLimit);

        const normalizedQuestions = (Array.isArray(questions) ? questions : [])
            .filter((q) => q.text && q.text.trim() !== "")
            .map((q, index) => ({
                text: q.text,
                order: index + 1,
                image: q.image || null,
                options: {
                    create: (Array.isArray(q.answers) ? q.answers : [])
                        .filter((answer) => answer.trim() !== "")
                        .map((answer, i) => ({
                            text: answer,
                            isCorrect: q.correctIndex === i,
                        })),
                },
            }));

        const currentQuestions = await prisma.question.findMany({
            where: { quizId: existingQuiz.id },
            select: { id: true },
        });
        const currentQuestionIds = currentQuestions.map((question) => question.id);
        const currentAttempts = await prisma.attempt.findMany({
            where: { quizId: existingQuiz.id },
            select: { id: true },
        });
        const currentAttemptIds = currentAttempts.map((attempt) => attempt.id);

        const updatedQuiz = await prisma.$transaction(async (tx) => {
            await tx.attemptAnswer.deleteMany({
                where: { attemptId: { in: currentAttemptIds } },
            });
            await tx.attempt.deleteMany({
                where: { quizId: existingQuiz.id },
            });
            await tx.answerOption.deleteMany({
                where: { questionId: { in: currentQuestionIds } },
            });
            await tx.question.deleteMany({
                where: { quizId: existingQuiz.id },
            });

            return tx.quiz.update({
                where: { id: existingQuiz.id },
                data: {
                    title,
                    description,
                    thumbnail: thumbnail || null,
                    timeLimit: normalizedTimeLimit,
                    isPublished: publishedState,
                    moderationStatus,
                    moderationReason: moderation.reason || null,
                    moderatedAt: new Date(),
                    questions: {
                        create: normalizedQuestions,
                    },
                },
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        },
                    },
                    questions: {
                        orderBy: { order: "asc" },
                        include: {
                            options: true,
                        },
                    },
                },
            });
        });

        res.status(200).json(updatedQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update quiz" });
    }
};

const getQuizById = async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await prisma.quiz.findUnique({
            where: { id: Number(quizId) },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                category: true,
                difficulty: true,
                timeLimit: true,
                isPublished: true,
                moderationStatus: true,
                moderationReason: true,
                moderatedAt: true,
                creatorId: true,
                creator: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                questions: {
                    orderBy: { order: "asc" },
                    select: {
                        id: true,
                        text: true,
                        order: true,
                        image: true,
                        options: {
                            select: {
                                id: true,
                                text: true,
                            },
                        },
                    },
                },
            },
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (!canAccessQuiz(req.user, quiz)) {
            return res.status(403).json({ message: "This quiz is private" });
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch quiz" });
    }
};

const checkAnswer = async (req, res) => {
    try {
        const { optionId, questionId } = req.body;

        if (!optionId && !questionId) {
            return res.status(400).json({ message: "optionId or questionId is required" });
        }

        let quiz = null;
        let correctOptionId = null;
        let isCorrect = false;

        if (optionId) {
            const option = await prisma.answerOption.findUnique({
                where: { id: Number(optionId) },
                include: {
                    question: {
                        include: {
                            quiz: {
                                select: {
                                    id: true,
                                    creatorId: true,
                                    isPublished: true,
                                },
                            },
                            options: {
                                where: { isCorrect: true },
                                select: { id: true },
                            },
                        },
                    },
                },
            });

            if (!option) {
                return res.status(404).json({ message: "Option not found" });
            }

            quiz = option.question.quiz;
            correctOptionId = option.question.options[0]?.id;
            isCorrect = option.isCorrect;
        } else {
            const question = await prisma.question.findUnique({
                where: { id: Number(questionId) },
                include: {
                    quiz: {
                        select: {
                            id: true,
                            creatorId: true,
                            isPublished: true,
                        },
                    },
                    options: {
                        where: { isCorrect: true },
                        select: { id: true },
                    },
                },
            });

            if (!question) {
                return res.status(404).json({ message: "Question not found" });
            }

            quiz = question.quiz;
            correctOptionId = question.options[0]?.id;
        }

        if (!canAccessQuiz(req.user, quiz)) {
            return res.status(403).json({ message: "This quiz is private" });
        }

        if (!correctOptionId) {
            return res.status(500).json({ message: "Quiz answer data is incomplete" });
        }

        res.status(200).json({
            correct: isCorrect,
            correctOptionId,
            timedOut: !optionId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to check answer" });
    }
};

const getAllQuizzes = async (req, res) => {
    try {
        const select = {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            category: true,
            difficulty: true,
            timeLimit: true,
            isPublished: true,
            moderationStatus: true,
            moderationReason: true,
            moderatedAt: true,
            createdAt: true,
            creator: {
                select: {
                    id: true,
                    email: true,
                    username: true,
                },
            },
            _count: {
                select: {
                    questions: true,
                },
            },
        };

        const quizzes = await prisma.quiz.findMany({
            where: isAdminRole(req.user?.role)
                ? {}
                : {
                    OR: [
                        { isPublished: true, moderationStatus: "APPROVED" },
                        { creatorId: req.user.id },
                    ],
                },
            select,
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch quizzes" });
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await prisma.quiz.findUnique({
            where: { id: Number(quizId) },
            select: {
                id: true,
                creatorId: true,
            },
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (!canManageContent(req.user, quiz.creatorId)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const questions = await prisma.question.findMany({
            where: { quizId: quiz.id },
            select: { id: true },
        });
        const questionIds = questions.map((question) => question.id);
        const attempts = await prisma.attempt.findMany({
            where: { quizId: quiz.id },
            select: { id: true },
        });
        const attemptIds = attempts.map((attempt) => attempt.id);

        await prisma.$transaction([
            prisma.attemptAnswer.deleteMany({
                where: { attemptId: { in: attemptIds } },
            }),
            prisma.attempt.deleteMany({
                where: { quizId: quiz.id },
            }),
            prisma.answerOption.deleteMany({
                where: {
                    questionId: {
                        in: questionIds,
                    },
                },
            }),
            prisma.question.deleteMany({
                where: { quizId: quiz.id },
            }),
            prisma.quiz.delete({
                where: { id: quiz.id },
            }),
        ]);

        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete quiz" });
    }
};

const useSkill = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { skillName } = req.body;

        const question = await prisma.question.findUnique({
            where: { id: Number(questionId) },
            include: {
                quiz: {
                    select: {
                        id: true,
                        creatorId: true,
                        isPublished: true,
                    },
                },
                options: true,
            },
        });

        if (!question) return res.status(404).json({ message: "Question not found" });
        if (!canAccessQuiz(req.user, question.quiz)) {
            return res.status(403).json({ message: "This quiz is private" });
        }

        const correctOption = question.options.find((o) => o.isCorrect);
        const incorrectOptions = question.options.filter((o) => !o.isCorrect);

        let data = {};

        if (skillName === "Battle Fury") {
            const shuffled = [...incorrectOptions].sort(() => 0.5 - Math.random());
            data.removedOptionIds = shuffled.slice(0, 2).map((option) => option.id);
        } else if (skillName === "Incantation") {
            const shuffled = [...incorrectOptions].sort(() => 0.5 - Math.random());
            data.removedOptionIds = shuffled.slice(0, 1).map((option) => option.id);
        } else if (skillName === "Arcane Knowledge" || skillName === "Crowd Mentality") {
            data.correctOptionId = correctOption?.id;
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
    useSkill,
    deleteQuiz,
    updateQuiz,
};
