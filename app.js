// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./db"); // we'll create this next

const app = express();

// Connect to MongoDB
connectDB();

// Built-in middleware
app.use(cors());
app.use(express.json());

// Health check route (optional)
app.get("/", (req, res) => {
  res.send("Dog Adoption API is running 🐶");
});

// routes here
app.use("/api/auth", require("./routes/auth"));
app.use("/api/dogs", require("./routes/dog"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
