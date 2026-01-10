require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

const authRoutes = require("./routes/auth.routes");

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("AIBA Backend Server is still running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})