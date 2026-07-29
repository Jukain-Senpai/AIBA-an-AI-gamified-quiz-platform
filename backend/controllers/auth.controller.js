const jwt = require("jsonwebtoken");
const {
    registerUser,
    loginUser,
    requestPasswordReset,
    verifyPasswordResetCode,
    resetPassword,
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
        console.log('[DEBUG] Login request body:', req.body);
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role || "user" },
            process.env.JWT_SECRET || "dev-secret",
            { expiresIn: "1h" }
        );
        // Log token creation for debugging (remove in prod)
        console.log('[DEBUG] Token generated for user', user.id);
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(401).json({
            error: error.message,
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const result = await requestPasswordReset(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

const verifyResetCode = async (req, res) => {
    try {
        const result = await verifyPasswordResetCode(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

const resetUserPassword = async (req, res) => {
    try {
        const result = await resetPassword(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

module.exports = {
    testAuth,
    register,
    login,
    forgotPassword,
    verifyResetCode,
    resetUserPassword,
};