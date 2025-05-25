const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Bearer TOKEN
        const token = authHeader.split(" ")[1];

        jwt.verify(token, "your_secret_key", (err, user) => {
            if (err) {
                return res.status(403).json({ error: "Invalid token" });
            }
            req.user = user; // user info available in req.user
            next();
        });
    } else {
        res.status(401).json({ error: "Authorization header missing" });
    }
};

module.exports = authenticateJWT;
