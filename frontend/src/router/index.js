import { createRouter, createWebHistory } from "vue-router";

import Landing from "../views/Landing.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
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
import ReportIssue from "../views/ReportIssue.vue";
import Admin from "../views/Admin.vue";
import { getCurrentUserRole } from "../services/session";

const routes = [
    { path: "/", component: Landing },

    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/forgot-password", component: ForgotPassword },
    { path: "/reset-password", component: ResetPassword },
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
    { path: "/forum/report", component: ReportIssue },
    { path: "/admin", component: Admin, meta: { requiresAdmin: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
    const loggedIn = localStorage.getItem('token');
    const userRole = getCurrentUserRole();

    if (!publicPages.includes(to.path) && !loggedIn) {
        return next('/login');
    }

    if (to.meta.requiresAdmin && !['admin', 'mod'].includes(userRole)) {
        return next('/dashboard');
    }

    next();
});

export default router;
