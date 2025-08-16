// db.js

// Import mongoose to work with MongoDB
const mongoose = require("mongoose");

// Load environment variables (to access MONGODB_URI & DB_NAME)
require("dotenv").config();

const connectDB = async () => {
  try {
    // Connect to the database using values from your .env file
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Stop the app if we can't connect
  }
};

module.exports = connectDB;
