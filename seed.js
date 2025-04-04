const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./models/user");
const Product = require("./models/product");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB - yə bağlanmağa çalışır...");
  })
  .catch((err) => {
    console.error("❌ MongoDB - yə bağlanma zamanı xəta:", err);
  });

// const users = [
//   {
//     name: "Admin",
//     surname: "User",
//     email: "admin@example.com",
//     password: bcrypt.hashSync("admin123", 10), // Hashed password
//     role: "admin",
//   },
// ];

// const products = [
//   {
//     id: "1",
//     name: "Rounded Red Hat",
//     details:
//       "Rounded Red Hat is a stylish and vibrant accessory that adds a touch of elegance and charm to any outfit, perfect for casual or formal occasions.",
//     price: 80,
//     productImage: "uploads/redHat.png",
//   },
//   {
//     id: "2",
//     name: "Linen-blend Shirt",
//     details:
//       "Linen-blend Shirt is a comfortable and lightweight clothing option made from a blend of linen and other materials. Perfect for keeping you cool and stylish in warm weather.",
//     price: 45,
//     productImage: "uploads/linenBlen.png",
//   },
//   {
//     id: "3",
//     name: "Long-sleeve Coat",
//     details:
//       "Long-sleeve Coat is a stylish and practical outerwear choice, perfect for chilly weather. Its durable design and comfortable fit make it a great addition to any wardrobe.",
//     price: 23,
//     productImage: "uploads/longCoat.png",
//   },
//   {
//     id: "4",
//     name: "Boxy Denim Hat",
//     details:
//       "Boxy Denim Hat is a trendy and timeless accessory that combines style and functionality, perfect for any casual outing.",
//     price: 56,
//     productImage: "uploads/boxyDenimHat.png",
//   },
//   {
//     id: "5",
//     name: "Linen Plain Top",
//     details:
//       "Linen Plain Top is a simple and elegant wardrobe staple that offers both comfort and style. Made from high-quality linen, it is perfect for both casual and formal occasions.",
//     price: 78,
//     productImage: "uploads/plainTop.png",
//   },
//   {
//     id: "6",
//     name: "Oversized T-shirt",
//     details:
//       "Oversized T-shirt is a comfortable and loose-fitting clothing item, perfect for casual wear. It provides both style and ease, making it a versatile addition to any wardrobe.",
//     price: 99,
//     productImage: "uploads/oversized.png",
//   },
//   {
//     id: "7",
//     name: "Polarised Sunglasses",
//     details:
//       "Polarised Sunglasses are designed to reduce glare and provide clear vision in bright conditions. They are perfect for outdoor activities and offer both style and protection.",
//     price: 45,
//     productImage: "uploads/polariedSunglass.png",
//   },
//   {
//     id: "8",
//     name: "Rockstar Jacket",
//     details:
//       "Rockstar Jacket is a fashionable and edgy outerwear option that exudes confidence and style, making it a must-have for anyone looking to make a bold statement.",
//     price: 116,
//     productImage: "uploads/rockstarJacket.png",
//   },
// ];

const seedDatabase = async () => {
  try {
    // await User.deleteMany();
    // await Product.deleteMany();

    // await User.insertMany(users);
    // await Product.insertMany(products);

    console.log("✅ Məlumatlar MongoDB - yə əlavə olundu !");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Xəta baş verdi:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
