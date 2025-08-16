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
exports.adoptDog = async (req, res) => {
  try {
    const dogId = req.params.id;
    const { thankYouMessage } = req.body;
    const userId = req.user.userId;

    const dog = await Dog.findById(dogId);

    // Doesn't exist?
    if (!dog) return res.status(404).json({ message: "Dog not found" });

    // Already adopted?
    if (dog.status === "adopted") {
      return res.status(400).json({ message: "Dog already adopted" });
    }

    // Can't adopt your own dog
    if (dog.owner.toString() === userId) {
      return res.status(403).json({ message: "You cannot adopt your own dog" });
    }

    dog.status = "adopted";
    dog.adoptedBy = userId;
    dog.thankYouMessage =
      thankYouMessage || "Thank you for trusting me with your fur baby!";

    await dog.save();

    res.json({ message: "Dog adopted successfully", dog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
