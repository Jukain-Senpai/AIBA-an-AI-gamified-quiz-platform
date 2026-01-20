require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const authRoutes = require("./routes/auth.routes");
const quizRoutes = require("./routes/quiz.routes");

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);

app.get("/", (req, res) => {
  res.send("AIBA Backend Server is still running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})