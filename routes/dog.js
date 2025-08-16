// routes/dog.js
// Handles dog-related endpoints under /api/dogs (register, adopt, delete, list)

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  registerDog,
  adoptDog,
  deleteDog,
  getRegisteredDogs,
  getAdoptedDogs,
} = require("../controllers/dogController");

// GET /api/dogs – List dogs registered by the current user (with filters/pagination)
router.get("/", authMiddleware, getRegisteredDogs);

// POST /api/dogs – Register a new dog (authenticated users only)
router.post("/", authMiddleware, registerDog);

// POST /api/dogs/:id/adopt – Adopt a dog
router.post("/:id/adopt", authMiddleware, adoptDog);

// DELETE /api/dogs/:id – Delete a dog (only by owner, if not adopted)
router.delete("/:id", authMiddleware, deleteDog);

// GET /api/dogs/adopted – List dogs the user has adopted
router.get("/adopted", authMiddleware, getAdoptedDogs);

module.exports = router;
