require("dotenv").config();
const cors = require("cors");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const authRoutes = require("./routes/auth.routes");
const quizRoutes = require("./routes/quiz.routes");
const answerOptionRoutes = require("./routes/answerOption.routes");
const skillRoutes = require("./routes/skill.routes");

app.use("/users", require("./routes/users.routes"));
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api", answerOptionRoutes);
app.use("/skills", skillRoutes)


app.get("/", (req, res) => {
  res.send("AIBA Backend Server is still running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})