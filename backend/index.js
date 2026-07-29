const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const cors = require("cors");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { logEmailMode } = require("./services/email.service");

const app = express();

// ===== CORS Configuration =====
const allowedOrigins = [
    "http://localhost:5173",
    "https://aibagame.netlify.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Handle preflight requests
app.options('/*', cors());

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== Routes =====
const authRoutes = require("./routes/auth.routes");
const quizRoutes = require("./routes/quiz.routes");
const answerOptionRoutes = require("./routes/answerOption.routes");
const skillRoutes = require("./routes/skill.routes");
const aiRoutes = require("./routes/ai.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const reportIssueRoutes = require("./routes/reportIssue.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");
const uploadRoutes = require("./routes/uploads.routes");

app.use("/api/users", require("./routes/users.routes"));
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api", answerOptionRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reports", reportIssueRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: Date.now() }));

app.get("/", (req, res) => {
    res.send("AIBA Backend Server is still running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    logEmailMode().catch((error) => {
        console.error("[Email] Startup verification failed:", error.message);
    });
});