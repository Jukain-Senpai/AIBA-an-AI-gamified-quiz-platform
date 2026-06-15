const prisma = require('./utils/prisma');

async function test() {
    try {
        const user = await prisma.user.findFirst();
        const quiz = await prisma.quiz.findFirst();
        
        if (!user || !quiz) {
            console.log("No user or quiz");
            return;
        }
        
        const question = await prisma.question.findFirst({ where: { quizId: quiz.id }});
        if (!question) {
            console.log("No question");
            return;
        }
        
        const option = await prisma.answerOption.findFirst({ where: { questionId: question.id }});
        if (!option) {
            console.log("No option");
            return;
        }
        
        const req = {
            user: { id: user.id },
            params: { quizId: quiz.id.toString() },
            body: { answers: [ { selectedOptionId: option.id } ] }
        };
        
        const res = {
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                console.log("RESPONSE HTTP", this.statusCode, ":", data);
            }
        };
        
        const { submitQuizAttempt } = require('./controllers/attempt.controller');
        
        await submitQuizAttempt(req, res);
        
    } catch(e) {
        console.error("Uncaught exception:", e);
    } finally {
        await prisma.$disconnect();
    }
}
test();
