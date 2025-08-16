// routes/dog.js – Endpoints under /api/dogs (register, adopt, delete, list)

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

// @route GET /api/dogs – List dogs registered by the user
router.get("/", authMiddleware, getRegisteredDogs);

// @route POST /api/dogs – Register a new dog
router.post("/", authMiddleware, registerDog);

// @route POST /api/dogs/:id/adopt – Adopt a dog
router.post("/:id/adopt", authMiddleware, adoptDog);

// @route DELETE /api/dogs/:id – Delete a dog
router.delete("/:id", authMiddleware, deleteDog);

// @route GET /api/dogs/adopted – List adopted dogs
router.get("/adopted", authMiddleware, getAdoptedDogs);

module.exports = router;
