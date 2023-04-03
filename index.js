// URLS
require("dotenv").config();
const dbPort = process.env.DB_PORT;
const dbUrl = process.env.DB_URL;

// Import Express
const express = require("express");

// Import Routers
const usersRouter = require("./routers/usersRouter");

// Create server
const server = express();

// Converting body data to json for all request methodts.
server.use(express.json());
server.use(`/${dbUrl}`, usersRouter);

// Get method
server.get("/", (req, res) => {
  res.send("Welcome to API");
});

// Listening server
server.listen(dbPort, () => {
  console.log("API IS WORKING...");
});
