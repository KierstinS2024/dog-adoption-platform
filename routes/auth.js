// routes/auth.js
// Handles user auth endpoints (register/login) under /api/auth

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/auth/register – Register a new user
router.post("/register", registerUser);

// POST /api/auth/login – Login an existing user
router.post("/login", loginUser);

module.exports = router;
