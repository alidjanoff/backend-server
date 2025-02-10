// const express = require('express');
// const router = express.Router();
// const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// // Get all products (any user can view products)
// router.get('/products', getProducts);

// // Get a single product by ID (any user can view a product)
// router.get('/products/:id', getProductById);

// // Add a new product (only admin can add)
// router.post('/products', addProduct);

// // Update an existing product (only admin can update)
// router.put('/products/:id', updateProduct);  // PUT için updateProduct fonksiyonu kullanılıyor

// // Delete a product (only admin can delete)
// router.delete('/products/:id', deleteProduct);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");

// Tüm ürünleri getir (herkes erişebilir)
router.get("/products", getProducts);

// Belirli bir ürünü ID ile getir (herkes erişebilir)
router.get("/products/:id", getProductById);

// Yeni bir ürün ekle (sadece admin ekleyebilir)
router.post("/products", addProduct);

// Mevcut bir ürünü güncelle (sadece admin güncelleyebilir)
router.put("/products/:id", updateProduct);

// Bir ürünü sil (sadece admin silebilir)
router.delete("/products/:id", deleteProduct);

module.exports = router;
