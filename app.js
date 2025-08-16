// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Dog Adoption API is running 🐶");
});

// Route handlers
app.use("/api/auth", require("./routes/auth"));
app.use("/api/dogs", require("./routes/dog"));

// Start server *after* database connection succeeds
async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

startServer();
