const router = require("express").Router();

let data = require("../data.js");

// Get users
router.get("/", (req, res) => {
  res.status(200).json(data);
});

let next_id = 5;

// Post user
router.post("/", (req, res) => {
  let newUser = req.body;
  newUser.id = next_id;
  next_id++;
  data.push(newUser);
  res.status(201).json(newUser);
});

// Delete user
router.delete("/:id", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = data.find((user) => user.id === Number(id));
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send("User not found");
  }
});

module.exports = router;
