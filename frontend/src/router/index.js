import { createRouter, createWebHistory } from "vue-router";

import Landing from "../views/Landing.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Dashboard from "../views/Dashboard.vue";
import QuizList from "../views/QuizList.vue";
import QuizDetail from "../views/QuizDetail.vue";
import QuizResult from "../views/QuizResult.vue";
import CreateQuiz from "../views/CreateQuiz.vue";
import Profile from "../views/Profile.vue";
import Skills from "../views/Skills.vue";
import CommunityHub from "../views/CommunityHub.vue";
import Discussion from "../views/Discussion.vue";
import CreatePost from "../views/CreatePost.vue";

const routes = [
    { path: "/", component: Landing },

    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/dashboard", component: Dashboard },
    { path: "/quizzes", component: QuizList },
    { path: "/quizzes/:id", component: QuizDetail },
    { path: "/result", component: QuizResult },
    { path: "/create-quiz", component: CreateQuiz },
    { path: "/profile", component: Profile },
    { path: "/skills", component: Skills },
    { path: "/forum", component: CommunityHub },
    { path: "/forum/post/:id", component: Discussion },
    { path: "/forum/create", component: CreatePost },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;