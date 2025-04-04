const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: null },
  otp: { type: String, default: null },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  age: { type: String, default: null },
  registerDate: { type: String, default: new Date().toString() },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", userSchema);
