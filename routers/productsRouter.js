const router = require("express").Router();

let products = require("../database/products.js");

// Get products
router.get("/", (req, res) => {
  res.status(200).json(products);
});

let next_id = 6;

// Post product
router.post("/", (req, res, next) => {
  let newProduct = req.body;
  newProduct.id = next_id;
  next_id++;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Delete product
router.delete("/:id", (req, res) => {
  const productID = req.params.id;
  const deletedProduct = products.find(
    (product) => product.id === Number(productID)
  );
  if (deletedProduct) {
    products = products.filter((product) => product.id !== Number(productID));
    res.status(204).end();
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Edit product
router.put("/:id", (req, res) => {
  const productID = req.params.id;
  const currentProduct = req.body;
  const editedProductIndex = products.findIndex(
    (product) => product.id === Number(productID)
  );
  if (editedProductIndex !== -1) {
    products[editedProductIndex] = {
      id: Number(productID),
      name: currentProduct.name,
      surname: currentProduct.surname,
      specialty: currentProduct.specialty,
    };
    res.status(200).json(products);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Get product for id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((product) => product.id === Number(id));
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).send("Product not found");
  }
});

module.exports = router;
