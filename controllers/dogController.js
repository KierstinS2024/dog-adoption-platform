// controllers/dogController.js

const Dog = require("../models/Dog");

// @route POST /api/dogs – Register a new dog
exports.registerDog = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.userId;

    const dog = await Dog.create({ name, description, owner: userId });
    res
      .status(201)
      .json({ success: true, message: "Dog registered", data: dog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route POST /api/dogs/:id/adopt – Adopt a dog
exports.adoptDog = async (req, res) => {
  try {
    const dogId = req.params.id;
    const userId = req.userId;
    const { thankYouMessage } = req.body;

    const dog = await Dog.findById(dogId);
    if (!dog) return res.status(404).json({ message: "Dog not found" });
    if (dog.owner.toString() === userId)
      return res.status(403).json({ message: "You cannot adopt your own dog" });
    if (dog.status === "adopted")
      return res.status(400).json({ message: "Dog already adopted" });

    dog.status = "adopted";
    dog.adoptedBy = userId;
    dog.thankYouMessage =
      thankYouMessage || "Thank you for trusting me with your fur baby!";

    await dog.save();
    res.json({ success: true, message: "Dog adopted", data: dog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route DELETE /api/dogs/:id – Delete dog if owner & not adopted
exports.deleteDog = async (req, res) => {
  try {
    const dogId = req.params.id;
    const userId = req.userId;

    const dog = await Dog.findById(dogId);
    if (!dog) return res.status(404).json({ message: "Dog not found" });
    if (dog.owner.toString() !== userId)
      return res
        .status(403)
        .json({ message: "You can only delete dogs you registered" });
    if (dog.status === "adopted")
      return res.status(400).json({ message: "Cannot delete an adopted dog" });

    await dog.deleteOne();
    res.json({ message: "Dog successfully removed from platform" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route GET /api/dogs – List dogs registered by user
exports.getRegisteredDogs = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { owner: userId };
    if (status) filter.status = status;

    const dogs = await Dog.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: dogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route GET /api/dogs/adopted – List dogs adopted by user
exports.getAdoptedDogs = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    const dogs = await Dog.find({ adoptedBy: userId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: dogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
