const { v4: uuidv4 } = require("uuid");

const users = [
  {
    id: uuidv4(),
    name: "Admin User",
    surname: "Admin",
    email: "admin@example.com",
    password: "$2b$10$/Dvy2bAAcNmSH/PcaxdeQuf5UmOaB4vQ186OKhi8n8GDB6jiNM7Sa",
    profileImage: null,
    otp: null,
    role: "admin",
  },
];

module.exports = users;
