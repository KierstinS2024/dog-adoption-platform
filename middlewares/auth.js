// middlewares/auth.js

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Must include "Authorization: Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // In our case, decoded = { userId, iat, exp }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId; // easy direct access (instead of req.user.userId)
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
