const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("⏳ MongoDB - yə bağlanmağa çalışır...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB - yə bağlandı");
  } catch (err) {
    console.error("❌ MongoDB bağlantı xətası:", err);
    console.error("📌 .env faylında olan MONGODB_URI - nin düzgün olduğunu yoxla");
    process.exit(1);
  }
};
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend server http://localhost:${PORT} ünvanında başladıldı.\nDeveloper: Tərlan Əlicanov`);
});
