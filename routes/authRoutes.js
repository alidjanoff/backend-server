const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendOTP,
  changeProfileImage,
  changePassword,
  sendResetPasswordOTP,
  deleteUserAccount,
  sendDeleteAccountOTP,
} = require("../controllers/authController");

// Kullanıcı kayıt işlemi
router.post("/register", registerUser);

// Kullanıcı giriş işlemi
router.post("/login", loginUser);

// OTP gönderme
router.post("/send-otp", sendOTP);

// Profil resmi değiştirme (auth required)
router.put("/users/profile", changeProfileImage);

// Şifre değiştirme (auth required)
router.post("/change-password", changePassword);

// Şifre sıfırlama işlemi için OTP gönderme
router.post("/send-reset-password-otp", sendResetPasswordOTP);

// Hesap silme işlemi (auth required)
router.post("/delete-account", deleteUserAccount);

// Hesap silme için OTP gönderme
router.post("/send-delete-account-otp", sendDeleteAccountOTP);

module.exports = router;
