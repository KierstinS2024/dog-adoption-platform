// routes/auth.js – Register & login endpoints under /api/auth

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// @route POST /api/auth/register – Register a new user
router.post("/register", registerUser);

// @route POST /api/auth/login – Login existing user
router.post("/login", loginUser);

module.exports = router;
