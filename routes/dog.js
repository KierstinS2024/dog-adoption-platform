// routes/dog.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const { registerDog } = require("../controllers/dogController");

// POST /api/dogs → Register a new dog (must be logged in)
router.post("/", authMiddleware, registerDog);

module.exports = router;
