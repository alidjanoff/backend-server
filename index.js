// Import Express
const express = require("express");
// Import Data
const data = require("./data.js");
// Create server
const server = express();

// Get method
server.get("/", (req, res) => {
  res.send("Welcome to API");
});

// Get users
server.get("/users", (req, res) => {
  res.status(200).json(data);
});

// Get user for id
server.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = data.find((user) => user.id === Number(id));
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send("User not found");
  }
});

// Listening server
server.listen(8000, () => {
  console.log("http://localhost:8000 url is listening...");
});
