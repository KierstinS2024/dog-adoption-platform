// routes/dog.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  registerDog,
  adoptDog,
  deleteDog,
} = require("../controllers/dogController");

// POST /api/dogs → Register a new dog (must be logged in)
router.post("/", authMiddleware, registerDog);
const { registerDog, adoptDog } = require("../controllers/dogController");

// POST /api/dogs/:id/adopt → Adopt a dog
router.post("/:id/adopt", authMiddleware, adoptDog);

//DELETE
router.delete("/:id", authMiddleware, deleteDog);

module.exports = router;
