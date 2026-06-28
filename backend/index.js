require("dotenv").config();
const cors = require("cors");
const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const authRoutes = require("./routes/auth.routes");
const quizRoutes = require("./routes/quiz.routes");
const answerOptionRoutes = require("./routes/answerOption.routes");
const skillRoutes = require("./routes/skill.routes");
const aiRoutes = require("./routes/ai.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const uploadRoutes = require("./routes/uploads.routes");

app.use("/api/users", require("./routes/users.routes"));
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api", answerOptionRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/uploads", uploadRoutes);


app.get("/", (req, res) => {
  res.send("AIBA Backend Server is still running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
