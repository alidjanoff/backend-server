const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
