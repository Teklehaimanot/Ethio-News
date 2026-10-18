require("dotenv/config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["x-auth"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(404).json({ error: "User Token not found" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.status(401).json({ error: "you are not authorized" });
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
