require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

// In-memory database
let users = [];
let idCounter = 1;

// Routes
app.get("/", (req, res) => {
  res.send("Server is working!");
});

// Create user
app.post("/user", (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const newUser = { id: idCounter++, name, email };
    users.push(newUser);

    res.json({
      message: `Hello, ${name}!`,
      user: newUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Get user
app.get("/user/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    message: `User ${id} profile`,
    user
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});