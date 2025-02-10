// const { v4: uuidv4 } = require("uuid");

// const users = [
//   {
//     id: uuidv4(),
//     name: "Admin User",
//     surname: "Admin",
//     email: "admin@example.com",
//     password: "$2b$10$/Dvy2bAAcNmSH/PcaxdeQuf5UmOaB4vQ186OKhi8n8GDB6jiNM7Sa",
//     profileImage: null,
//     otp: null,
//     role: "admin",
//   },
// ];

// module.exports = users;


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: null },
    otp: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" }
});

module.exports = mongoose.model("User", userSchema);
