const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token; // get token from cookie

    if (!token) {
        return res.status(401).json({ error: "Authentication token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;
