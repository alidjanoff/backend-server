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
//     name: "Audi R8",
//     details:
//       "The Audi R8 is a supercar that stands out with its elegant design and superior performance. Equipped with cutting-edge technology features, the Audi R8 takes the driving experience to the next level.",
//     price: 190000,
//     productImage: "uploads/audi.png",
//   },
//   {
//     id: "2",
//     name: "BMW",
//     details:
//       "BMW is a German brand known for its luxurious and sporty cars. BMW models, which are made with high-quality materials and offer powerful engine options, enhance the driving experience.",
//     price: 84000,
//     productImage: "uploads/bmw.png",
//   },
//   {
//     id: "3",
//     name: "Chevrolet Camaro",
//     details:
//       "The Chevrolet Camaro is a sports car known for its powerful engine and iconic design. It grabs attention with its high performance and impressive appearance.",
//     price: 78000,
//     productImage: "uploads/camaro.png",
//   },
//   {
//     id: "4",
//     name: "Hyundai",
//     details:
//       "Hyundai is an automotive brand known for its economical and durable cars. It is preferred for its user-friendly features and affordable prices.",
//     price: 32000,
//     productImage: "uploads/hundai.png",
//   },
//   {
//     id: "5",
//     name: "Mercedes Benz",
//     details:
//       "Mercedes Benz is a globally recognized brand known for its luxury and prestigious cars. High quality, comfort, and superior performance are the hallmarks of Mercedes Benz.",
//     price: 92000,
//     productImage: "uploads/mercedes.png",
//   },
//   {
//     id: "6",
//     name: "Toyota Prado",
//     details:
//       "Toyota Prado is an SUV model known for its durability, safety, and off-road capabilities. It is suitable for both urban driving and challenging terrain conditions.",
//     price: 22000,
//     productImage: "uploads/prado.png",
//   },
//   {
//     id: "7",
//     name: "Toyota Prius",
//     details:
//       "Toyota Prius is a compact car that offers an environmentally friendly option with its hybrid engine technology. It stands out with fuel efficiency and low emissions.",
//     price: 16000,
//     productImage: "uploads/prius.png",
//   },
//   {
//     id: "8",
//     name: "Volkswagen",
//     details:
//       "Volkswagen is an automotive brand known for its wide range of models and reliable performance. It stands out with its stylish designs and user-friendly features.",
//     price: 47000,
//     productImage: "uploads/wolswagen.png",
//   },
// ];

// Verileri veritabanına ekle
const seedDatabase = async () => {
  try {
    // await User.deleteMany(); // Eski kullanıcıları sil
    // await Product.deleteMany(); // Eski ürünleri sil

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
