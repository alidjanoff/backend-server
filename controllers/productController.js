const multer = require("multer");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");

const isAdmin = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === "admin";
  } catch (err) {
    return false;
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("productImage");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send("Xəta: getProducts" + error.message);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Məhsul tapılmadı");

    res.send(product);
  } catch (error) {
    res.status(500).send("Xəta: getProductById" + error.message);
  }
};

const addProduct = async (req, res) => {
  const token = req.headers["authorization"];
  const userIsAdmin = isAdmin(token);

  if (!userIsAdmin) {
    return res.status(403).send("Sizin bu əməliyyat üçün icazəniz yoxdur");
  }

  upload(req, res, async (err) => {
    if (err) return res.status(400).send({ message: err.message });

    const { name, details, price } = req.body;

    try {
      const newProduct = new Product({
        name,
        details,
        price,
        productImage: req.file ? req.file.path : null,
      });

      await newProduct.save();
      res.send(newProduct);
    } catch (error) {
      res.status(500).send("Xəta: addProduct" + error.message);
    }
  });
};

const updateProduct = async (req, res) => {
  const token = req.headers["authorization"];
  const userIsAdmin = isAdmin(token);

  if (!userIsAdmin) {
    return res.status(403).send("Sizin bu əməliyyat üçün icazəniz yoxdur");
  }

  upload(req, res, async (err) => {
    if (err) return res.status(400).send({ message: err.message });

    try {
      const { name, details, price } = req.body;
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send("Məhsul tapılmadı");

      product.name = name || product.name;
      product.details = details || product.details;
      product.price = price || product.price;

      if (req.file) {
        product.productImage = req.file.path;
      }

      await product.save();
      res.send(product);
    } catch (error) {
      res.status(500).send("Xəta: updateProduct" + error.message);
    }
  });
};

const deleteProduct = async (req, res) => {
  const token = req.headers["authorization"];
  const userIsAdmin = isAdmin(token);

  if (!userIsAdmin) {
    return res.status(403).send("Sizin bu əməliyyat üçün icazəniz yoxdur");
  }
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({ message: "Məhsul uğurla silindi" });
  } catch (error) {
    res.status(500).send("Xəta: deleteProduct" + error.message);
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
