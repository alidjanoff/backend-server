// Import Express
const express = require("express");
// Import Data
let data = require("./data.js");
// Create server
const server = express();

// Converting body data to json for all request methodts.
server.use(express.json());

// Get method
server.get("/", (req, res) => {
  res.send("Welcome to API");
});

// Get users
server.get("/users", (req, res) => {
  res.status(200).json(data);
});

let next_id = 5;

// Post user
server.post("/users", (req, res) => {
  let newUser = req.body;
  newUser.id = next_id;
  next_id++;
  data.push(newUser);
  res.status(201).json(newUser);
});

// Delete user
server.delete("/users/:id", (req, res) => {
  const userID = req.params.id;
  const deletedUser = data.find((user) => user.id === Number(userID));
  if (deletedUser) {
    data = data.filter((user) => user.id !== Number(userID));
    res.status(204).end();
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Edit user
server.put("/users/:id", (req, res) => {
  const userID = req.params.id;
  const currentUser = req.body;
  const editedUserIndex = data.findIndex((user) => user.id === Number(userID));
  if (editedUserIndex !== -1) {
    data[editedUserIndex] = {
      id: Number(userID),
      name: currentUser.name,
      surname: currentUser.surname,
      specialty: currentUser.specialty,
    };
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: "User not found" });
  }
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
