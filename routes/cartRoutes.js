// const express = require('express');
// const router = express.Router();
// const { getCart, addToCart } = require('../controllers/cartController');

// router.get('/cart/:userId', getCart);
// router.post('/cart', addToCart);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getCart, addToCart } = require("../controllers/cartController");

// Kullanıcının sepetini getirme
router.get("/cart/:userId", getCart);

// Sepete ürün ekleme
router.post("/cart", addToCart);

module.exports = router;
