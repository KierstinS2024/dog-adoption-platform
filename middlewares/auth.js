// middlewares/auth.js

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  // Check for auth header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // place userId in req.user.userId so controllers can access it
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
