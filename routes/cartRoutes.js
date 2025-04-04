const express = require("express");
const router = express.Router();
const { getCart, addToCart } = require("../controllers/cartController");

router.get("/cart/:userId", getCart);

router.post("/cart", addToCart);

module.exports = router;
