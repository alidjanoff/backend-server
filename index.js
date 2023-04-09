// URLS
require("dotenv").config();
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbProduct = process.env.DB_PRODUCT;

// Import Express
const express = require("express");
const cors = require("cors");

// Import middlewares
const logger = require("./middlewares/logger");
const errorHandling = require("./middlewares/errorHandling");

// Import Routers
const usersRouter = require("./routers/usersRouter");
const productsRouter = require("./routers/productsRouter");

// Create server
const server = express();

// Converting body data to json for all request methodts.
server.use(express.json());
server.use(cors());
server.use(logger);
server.use(`/${dbProduct}`, productsRouter);
server.use(`/${dbUser}`, usersRouter);

// Get method
server.get("/", (req, res) => {
  res.send("Welcome to API");
});

// User error middleware
server.use(errorHandling);

// Listening server
server.listen(dbPort, () => {
  console.log("API IS WORKING...");
});
