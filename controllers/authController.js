const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const users = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

// Multer dosya yükleme yapılandırması
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dosyaların kaydedileceği dizin
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Dosya ismini benzersiz yapıyoruz
  },
});

const upload = multer({ storage: storage }).single("profileImage"); // Tek dosya yükleme

// Kullanıcı kaydı
const registerUser = (req, res) => {
  const { name, surname, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: uuidv4(),
    name,
    surname,
    email,
    password: hashedPassword,
    profileImage: null,
    otp: null,
    role: "user", // Varsayılan olarak kullanıcı olarak ekleniyor
  };

  users.push(newUser);
  res.send("User is created");
};

// Kullanıcı girişi
const loginUser = (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send("Invalid email or password");
  }

  // Token oluşturulurken role bilgisi de ekleniyor
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1w" }
  );

  // Token'ı döndürüyoruz
  res.send({ token });
};

// OTP gönderme işlemi
const sendOTP = (req, res) => {
  const { email } = req.body;
  const user = users.find((user) => user.email === email);
  if (!user) return res.status(404).send("User not found");

  const otp = otpGenerator.generate(6, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  user.otp = otp;
  sendOTPToEmail(email, otp);
  res.send("OTP sent to email");
};

// OTP'yi e-posta ile gönderme
const sendOTPToEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.SECRET_KEY,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "Test Backend Service",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log("Email sent: " + info.response);
  });
};

// Profil resmini güncelleme
const changeProfileImage = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Token'ı header'dan alıyoruz

  // Token'ı doğruluyoruz
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    // Kullanıcıyı ID ile buluyoruz
    const user = users.find((user) => user.id === decoded.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Dosya yükleme işlemi
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).send("Error uploading file: " + err.message);
      }

      // Dosya yüklendiyse, profil resmini güncelliyoruz
      user.profileImage = req.file.path; // Burada file path'ini kullanıcı profil resmine atıyoruz

      // Kullanıcıyı güncel profil resmiyle beraber yanıtlıyoruz
      res.send({
        message: "Profile image updated successfully",
        profileImage: user.profileImage, // Yeni profil resmini döndürüyoruz
      });
    });
  });
};

// Şifre değiştirme
const changePassword = (req, res) => {
  const { oldPassword, newPassword, email, otp } = req.body;
  const token = req.headers.authorization;
  if (token) {
    // Kullanıcı giriş yapmışsa (JWT var)
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send("Invalid token");
      }

      const user = users.find((user) => user.id === decoded.userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Eski şifreyi kontrol et
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(401).send("Old password is incorrect");
      }

      // Yeni şifreyi güncelle
      user.password = bcrypt.hashSync(newPassword, 10);
      res.send("Password has been successfully changed");
    });
  } else if (email && otp) {
    // Kullanıcı giriş yapmamışsa (Şifreyi unuttuysa)
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.otp !== otp) {
      return res.status(401).send("Invalid OTP");
    }

    // Yeni şifreyi güncelle
    user.password = bcrypt.hashSync(newPassword, 10);

    // OTP'yi sil
    user.otp = null;
    res.send("Password has been successfully changed");
  } else {
    return res.status(400).send("Invalid request data");
  }
};

// Şifre sıfırlama işlemi için OTP gönderme
const sendResetPasswordOTP = (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = users.find((user) => user.email === email);
  console.log(user);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const otp = otpGenerator.generate(6, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  user.otp = otp;
  sendOTPToEmail(email, otp);
  res.send("OTP sent to email for password reset");
};

// Hesap silme işlemi
const deleteUserAccount = (req, res) => {
  const { otp } = req.body;

  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    const user = users.find((user) => user.id === decoded.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.otp !== otp) {
      return res.status(401).send("Invalid OTP");
    }

    const userIndex = users.indexOf(user);
    if (userIndex > -1) {
      users.splice(userIndex, 1);
    }

    res.send("User account has been successfully deleted");
  });
};

// Hesap silme için OTP gönderme
const sendDeleteAccountOTP = (req, res) => {
  const { email } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const otp = otpGenerator.generate(6, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  user.otp = otp;
  sendOTPToEmail(email, otp);
  res.send("OTP sent to email for account deletion");
};

module.exports = {
  registerUser,
  loginUser,
  sendOTP,
  changeProfileImage,
  changePassword,
  sendResetPasswordOTP,
  deleteUserAccount,
  sendDeleteAccountOTP,
};
