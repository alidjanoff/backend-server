const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./models/user");
const Product = require("./models/product");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected for seeding...");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Default users
// const users = [
//   {
//     name: "Admin",
//     surname: "User",
//     email: "admin@example.com",
//     password: bcrypt.hashSync("admin123", 10), // Hashed password
//     role: "admin",
//   },
//   {
//       name: "John",
//       surname: "Doe",
//       email: "john@example.com",
//       password: bcrypt.hashSync("123456", 10), // Hashed password
//       role: "user"
//   }
// ];

// Default products
// const products = [
//   {
//     id: "1",
//     name: "Rounded Red Hat",
//     details:
//         "Rounded Red Hat is a stylish and vibrant accessory that adds a touch of elegance and charm to any outfit, perfect for casual or formal occasions.",
//     price: 8,
//     productImage: "uploads/redHat.png",
//   },
//   {
//     id: "2",
//     name: "Linen-blend Shirt",
//     details:
//         "Linen-blend Shirt is a comfortable and lightweight clothing option made from a blend of linen and other materials. Perfect for keeping you cool and stylish in warm weather.",
//     price: 84000,
//     productImage: "uploads/linenBlen.png",
//   },
//   {
//     id: "3",
//     name: "Long-sleeve Coat",
//     details:
//         "Long-sleeve Coat is a stylish and practical outerwear choice, perfect for chilly weather. Its durable design and comfortable fit make it a great addition to any wardrobe.",
//     price: 78000,
//     productImage: "uploads/longCoat.png",
//   },
//   {
//     id: "4",
//     name: "Boxy Denim Hat",
//     details:
//         "Boxy Denim Hat is a trendy and timeless accessory that combines style and functionality, perfect for any casual outing.",
//     price: 32000,
//     productImage: "uploads/boxyDenimHat.png",
//   },
//   {
//     id: "5",
//     name: "Linen Plain Top",
//     details:
//         "Linen Plain Top is a simple and elegant wardrobe staple that offers both comfort and style. Made from high-quality linen, it is perfect for both casual and formal occasions.",
//     price: 92000,
//     productImage: "uploads/plainTop.png",
//   },
//   {
//     id: "6",
//     name: "Oversized T-shirt",
//     details:
//         "Oversized T-shirt is a comfortable and loose-fitting clothing item, perfect for casual wear. It provides both style and ease, making it a versatile addition to any wardrobe.",
//     price: 22000,
//     productImage: "uploads/oversized.png",
//   },
//   {
//     id: "7",
//     name: "Polarised Sunglasses",
//     details:
//         "Polarised Sunglasses are designed to reduce glare and provide clear vision in bright conditions. They are perfect for outdoor activities and offer both style and protection.",
//     price: 16000,
//     productImage: "uploads/polariedSunglass.png",
//   },
//   {
//     id: "8",
//     name: "Rockstar Jacket",
//     details:
//         "Rockstar Jacket is a fashionable and edgy outerwear option that exudes confidence and style, making it a must-have for anyone looking to make a bold statement.",
//     price: 47000,
//     productImage: "uploads/rockstarJacket.png",
//   },
// ];

// Verileri veritabanına ekle
const seedDatabase = async () => {
  try {
    // await User.deleteMany(); // Eski kullanıcıları sil
    // await Product.deleteMany(); // Eski ürünleri sil
    //
    // await User.insertMany(users);
    // await Product.insertMany(products);

    console.log("✅ Varsayılan kullanıcılar ve ürünler başarıyla eklendi!");
    mongoose.connection.close(); // İşlem tamamlandıktan sonra bağlantıyı kapat
  } catch (error) {
    console.error("❌ Hata oluştu:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
