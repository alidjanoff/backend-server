// const carts = require('../models/cart');
// const products = require('../models/product');

// const getCart = (req, res) => {
//   const { userId } = req.params;
//   const userCart = carts.find(cart => cart.userId === userId);
//   if (!userCart) return res.status(404).send("Cart not found");
//   res.send(userCart);
// };

// const addToCart = (req, res) => {
//   const { userId, productId, quantity } = req.body;
//   const product = products.find(product => product.id === productId);

//   if (!product) return res.status(404).send("Product not found");

//   let userCart = carts.find(cart => cart.userId === userId);
//   if (!userCart) {
//     userCart = { userId, items: [] };
//     carts.push(userCart);
//   }

//   const cartItem = userCart.items.find(item => item.productId === productId);
//   if (cartItem) {
//     cartItem.quantity += quantity;
//   } else {
//     userCart.items.push({ productId, quantity });
//   }

//   res.send(userCart);
// };

// module.exports = { getCart, addToCart };

const Cart = require("../models/cart");
const Product = require("../models/product");

// Kullanıcının sepetini getir
const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(404).send("Cart not found");

    res.send(cart);
  } catch (error) {
    res.status(500).send("Error fetching cart: " + error.message);
  }
};

// Sepete ürün ekleme
const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const cartItem = cart.items.find(item => item.productId.toString() === productId);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.send(cart);
  } catch (error) {
    res.status(500).send("Error adding to cart: " + error.message);
  }
};

module.exports = { getCart, addToCart };
