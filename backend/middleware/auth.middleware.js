const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
     const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).json({ error: "Not authorized, no token"});
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Invalid token format"});
    }

    // Safely extract token; expect format 'Bearer <token>'
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Invalid Authorization header format' });
    }
    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid Token" });
    }
};

module.exports = protect;