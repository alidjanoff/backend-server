// const multer = require("multer");
// const { v4: uuidv4 } = require("uuid");
// const products = require("../models/product");
// const jwt = require("jsonwebtoken");

// // Helper function to check if the user is an admin
// const isAdmin = (token) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded.role === "admin"; // Check if the user has 'admin' role
//   } catch (err) {
//     return false; // If token is invalid or user is not admin, return false
//   }
// };

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads"); // Destination for image files
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname); // File name with timestamp
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 }, // Maximum file size of 5MB
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype === "image/png" ||
//       file.mimetype === "image/jpeg" ||
//       file.mimetype === "image/webp"
//     ) {
//       cb(null, true); // Accept only image files
//     } else {
//       cb(new Error("Only image files are allowed"), false); // Reject non-image files
//     }
//   },
// }).single("productImage"); // Expecting a single file upload with field name 'productImage'

// // Get all products
// const getProducts = (req, res) => {
//   const token = req.headers["authorization"];
//   const userIsAdmin = isAdmin(token);

//   if (!userIsAdmin) {
//     return res.send(products); // Non-admin users can view products
//   } else {
//     return res.send(products); // Admin can also view products (they might have additional permissions for other actions)
//   }
// };

// // Get a single product by ID (any user can view a product)
// const getProductById = (req, res) => {
//   const product = products.find((product) => product.id === req.params.id);
//   if (!product) {
//     return res.status(404).send("Product not found");
//   }
//   res.send(product); // Return the product details
// };

// // Add a new product (only admin can add)
// const addProduct = (req, res) => {
//   const token = req.headers["authorization"];
//   const userIsAdmin = isAdmin(token);

//   if (!userIsAdmin) {
//     return res
//       .status(403)
//       .send("You are not authorized to perform this action");
//   }

//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(400).send({ message: err.message });
//     }

//     const { name, details, price } = req.body;

//     const newProduct = {
//       id: uuidv4(),
//       name,
//       details,
//       price,
//       productImage: req.file ? req.file.path : null, // Store the image path if file is uploaded
//     };

//     products.push(newProduct);
//     res.send(newProduct);
//   });
// };

// // Update an existing product (only admin can update)
// const updateProduct = (req, res) => {
//   const token = req.headers["authorization"];
//   const userIsAdmin = isAdmin(token);

//   if (!userIsAdmin) {
//     return res
//       .status(403)
//       .send("You are not authorized to perform this action");
//   }

//   // Ürünü ID'ye göre buluyoruz
//   const product = products.find((product) => product.id === req.params.id);
//   if (!product) {
//     return res.status(404).send("Product not found");
//   }

//   // Dosya yükleme işlemi
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(400).send({ message: err.message });
//     }

//     const { name, details, price } = req.body;

//     // Güncellenen ürün bilgilerini ayarlıyoruz
//     product.name = name || product.name;
//     product.details = details || product.details;
//     product.price = price || product.price;

//     // Eğer yeni bir dosya yüklenmişse, eski görseli güncelliyoruz
//     if (req.file) {
//       product.productImage = req.file.path; // Yeni dosyanın yolunu kaydediyoruz
//     }

//     res.send(product); // Güncellenmiş ürünü döndürüyoruz
//   });
// };

// // Delete a product (only admin can delete)
// const deleteProduct = (req, res) => {
//   const token = req.headers["authorization"];
//   const userIsAdmin = isAdmin(token);

//   if (!userIsAdmin) {
//     return res
//       .status(403)
//       .send("You are not authorized to perform this action");
//   }

//   const productIndex = products.findIndex(
//     (product) => product.id === req.params.id
//   );
//   if (productIndex === -1) {
//     return res.status(404).send("Product not found");
//   }

//   products.splice(productIndex, 1);
//   res.send({ message: "Product deleted successfully" });
// };

// module.exports = {
//   getProducts,
//   getProductById,
//   addProduct,
//   updateProduct,
//   deleteProduct,
// };


const multer = require("multer");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("productImage");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send("Error fetching products: " + error.message);
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

    res.send(product);
  } catch (error) {
    res.status(500).send("Error fetching product: " + error.message);
  }
};

// Add a new product (admin only)
const addProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).send({ message: err.message });

    const { name, details, price } = req.body;

    try {
      const newProduct = new Product({
        name,
        details,
        price,
        productImage: req.file ? req.file.path : null
      });

      await newProduct.save();
      res.send(newProduct);
    } catch (error) {
      res.status(500).send("Error adding product: " + error.message);
    }
  });
};

// Delete a product (admin only)
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send("Error deleting product: " + error.message);
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
};
