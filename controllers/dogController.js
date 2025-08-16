// controllers/dogController.js

const Dog = require("../models/Dog");

// @desc    Register a new dog
// @route   POST /api/dogs
exports.registerDog = async (req, res) => {
  try {
    const { name, description } = req.body;

    // create dog tied to the logged-in user (req.user.userId is set by auth middleware)
    const dog = await Dog.create({
      name,
      description,
      owner: req.user.userId,
    });

    res.status(201).json({ message: "Dog registered successfully", dog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
