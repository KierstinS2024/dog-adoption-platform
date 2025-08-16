// models/User.js

const mongoose = require("mongoose");

// Define the structure of a User document
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", UserSchema);
