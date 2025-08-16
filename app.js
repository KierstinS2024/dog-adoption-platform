// app.js – exports the Express app instance (no .listen here)
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Dog Adoption API is running 🐶");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/dogs", require("./routes/dog"));

module.exports = app;
