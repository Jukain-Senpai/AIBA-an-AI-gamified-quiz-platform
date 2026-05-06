const jwt = require("jsonwebtoken");
const { registerUser,
    loginUser,
 } = require("../services/auth.service");

const testAuth = (req, res) => {
    res.json({
        message: "Auth controller is working",
    });
};

const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        
        const token = jwt.sign(
            { id: user.id,
            email: user.email, 
            role: user.role || "user" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "User registered successfully",
            user,
            token,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
    });
}
};

const login = async (req, res) => {
    try {
        const user = await loginUser(req.body);
        const token = jwt.sign(
            { id: user.id,
            email: user.email, 
            role: user.role || "user" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        res.status(401).json({
            error: error.message,
        });
    }
};

module.exports = {
    testAuth,
    register,
    login,
};