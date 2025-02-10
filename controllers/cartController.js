const carts = require('../models/cart');
const products = require('../models/product');

const getCart = (req, res) => {
  const { userId } = req.params;
  const userCart = carts.find(cart => cart.userId === userId);
  if (!userCart) return res.status(404).send("Cart not found");
  res.send(userCart);
};

const addToCart = (req, res) => {
  const { userId, productId, quantity } = req.body;
  const product = products.find(product => product.id === productId);

  if (!product) return res.status(404).send("Product not found");

  let userCart = carts.find(cart => cart.userId === userId);
  if (!userCart) {
    userCart = { userId, items: [] };
    carts.push(userCart);
  }

  const cartItem = userCart.items.find(item => item.productId === productId);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    userCart.items.push({ productId, quantity });
  }

  res.send(userCart);
};

module.exports = { getCart, addToCart };
