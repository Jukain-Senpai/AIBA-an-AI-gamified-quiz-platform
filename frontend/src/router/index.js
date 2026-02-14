import { createRouter, createWebHistory } from "vue-router";

import Landing from "../views/Landing.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import QuizList from "../views/QuizList.vue";
import QuizDetail from "../views/QuizDetail.vue";
import QuizResult from "../views/QuizResult.vue";
import CreateQuiz from "../views/CreateQuiz.vue";

const routes = [
    { path: "/", component: Landing },

    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/quizzes", component: QuizList },
    { path: "/quizzes/:id", component: QuizDetail },
    { path: "/result", component: QuizResult },
    { path: "/create-quiz", component: CreateQuiz },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;