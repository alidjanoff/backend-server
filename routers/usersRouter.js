const router = require("express").Router();

let users = require("../database/users.js");

// Get users
router.get("/", (req, res) => {
  res.status(200).json(users);
});

let next_id = 5;

// Post user
router.post("/", (req, res, next) => {
  let newUser = req.body;

  if (!newUser.name) {
    next({ statusCode: 400, message: "Name is required" });
  } else if (newUser.name && !newUser.surname) {
    next({ statusCode: 400, message: "Surname is required" });
  } else {
    newUser.id = next_id;
    next_id++;
    users.push(newUser);
    res.status(201).json(newUser);
  }
});

// Delete user
router.delete("/:id", (req, res) => {
  const userID = req.params.id;
  const deletedUser = users.find((user) => user.id === Number(userID));
  if (deletedUser) {
    users = users.filter((user) => user.id !== Number(userID));
    res.status(204).end();
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Edit user
router.put("/:id", (req, res) => {
  const userID = req.params.id;
  const currentUser = req.body;
  const editedUserIndex = users.findIndex((user) => user.id === Number(userID));
  if (editedUserIndex !== -1) {
    users[editedUserIndex] = {
      id: Number(userID),
      name: currentUser.name,
      surname: currentUser.surname,
      specialty: currentUser.specialty,
    };
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Get user for id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === Number(id));
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send("User not found");
  }
});

module.exports = router;
