// seed.js – populate database with dummy users and dogs

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Dog = require("./models/Dog");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log("Connected to MongoDB for seeding…");

    // Clear existing collections
    await User.deleteMany();
    await Dog.deleteMany();

    // Create users
    const users = [
      { username: "alice", password: "password123" },
      { username: "bob", password: "password456" },
    ];

    // Hash passwords
    for (const u of users) {
      u.password = await bcrypt.hash(u.password, 10);
    }

    const createdUsers = await User.insertMany(users);
    console.log(
      "Users created:",
      createdUsers.map((u) => u.username)
    );

    // Create dogs
    const dogs = [
      {
        name: "Buddy",
        description: "Friendly golden retriever",
        owner: createdUsers[0]._id,
      },
      {
        name: "Luna",
        description: "Playful husky",
        owner: createdUsers[1]._id,
      },
    ];

    const createdDogs = await Dog.insertMany(dogs);
    console.log(
      "Dogs created:",
      createdDogs.map((d) => d.name)
    );

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
