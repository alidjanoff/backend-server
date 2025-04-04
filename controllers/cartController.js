const Cart = require("../models/cart");
const Product = require("../models/product");

const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(404).send("İstifadəçi səbəti tapılmadı");

    res.send(cart);
  } catch (error) {
    res.status(500).send("Xəta: getCart" + error.message);
  }
};

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Məhsul tapılmadı");

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const cartItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.send(cart);
  } catch (error) {
    res.status(500).send("Xəta: addToCart" + error.message);
  }
};

module.exports = { getCart, addToCart };
