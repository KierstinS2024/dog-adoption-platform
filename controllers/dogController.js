// @desc    Delete a dog from the platform
// @route   DELETE /api/dogs/:id
// @access  Private (owner-only, and only if dog not adopted)
exports.deleteDog = async (req, res) => {
  try {
    const dogId = req.params.id; // ID of the dog to delete
    const userId = req.user.userId; // ID of the currently authenticated user

    // 1) Look up the dog
    const dog = await Dog.findById(dogId);
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    // 2) Ensure they are the owner
    if (dog.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete dogs you registered" });
    }

    // 3) Block deletion if already adopted
    if (dog.status === "adopted") {
      return res
        .status(400)
        .json({ message: "Cannot delete a dog that has already been adopted" });
    }

    // 4) Otherwise delete the dog
    await dog.deleteOne();
    res.json({ message: "Dog successfully removed from platform" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
