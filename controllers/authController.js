const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage }).single("profileImage");

const registerUser = async (req, res) => {
  const { name, surname, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (name.trim() === "")
    return res.status(400).send("Ad yazmağınız tələb olunur");
  if (surname.trim() === "")
    return res.status(400).send("Soyad yazmağınız tələb olunur");
  if (email.trim() === "")
    return res.status(400).send("Email yazmağınız tələb olunur");
  if (password.trim() === "")
    return res.status(400).send("Şifrə yazmağınız tələb olunur");

  try {
    const newUser = new User({
      name,
      surname,
      email,
      password: hashedPassword,
      role: "user",
    });
    await newUser.save();
    res.send("İstifadəçi qeydiyyatı tamamlandı.");
  } catch (error) {
    res.status(500).send("Xəta registerUser: " + error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send("Yalnış email və ya şifrə");
    }
    if (!user.isActive) {
      return res
        .status(401)
        .send(
          "İstifadəçi profili aktiv deyil. Zəhmət olmasa yenidən aktivləşdirin."
        );
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );
    res.send({ token });
  } catch (error) {
    res.status(500).send("Xəta loginUser: " + error.message);
  }
};

const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("İstifadəçi tapılmadı");

    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    user.otp = otp;
    await user.save();

    sendOTPToEmail(email, otp);
    res.send(`OTP kodu ${email} elektron poçtuna göndərildi.`);
  } catch (error) {
    res.status(500).send("Xəta sendOTP: " + error.message);
  }
};

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
    from: "Backend Service",
    to: email,
    subject: "OTP Code",
    text: `Sizin OTP kodunuz: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log("Email sent: " + info.response);
  });
};

const changeProfileImage = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).send("Sorğu məlumatları yalnışdır");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");

    upload(req, res, async (err) => {
      if (err) return res.status(400).send("Şəkil yüklənmədi: " + err.message);

      user.profileImage = req.file.path;
      await user.save();

      res.send({
        message: "Profile şəkli uğurla dəyişdirildi",
        profileImage: user.profileImage,
      });
    });
  } catch (error) {
    res.status(500).send("Xəta changeProfileImage: " + error.message);
  }
};

const getUserProfileData = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).send("Sorğu məlumatları yalnışdır");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");

    res.send({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      phone: user.phone,
      address: user.address,
      age: user.age,
      registerDate: user.registerDate,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).send("Xəta" + error.message);
  }
};

const updateProfileData = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).send("Sorğu məlumatları yalnışdır");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");
    if (!user.isActive)
      return res
        .status(400)
        .send("İstifadəçi aktiv deyil. Zəhmət olmasa yenidən aktivləşdirin.");

    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.age = req.body.age || user.age;
    await user.save();

    res.send({
      message: "İstifadəçi məlumatları uğurla yeniləndi.",
      data: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        phone: user.phone,
        address: user.address,
        age: user.age,
        registerDate: user.registerDate,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).send("Xəta: " + error.message);
  }
};

const changeUserRole = async (req, res) => {
  const token = req.headers.authorization;
  const { user_id, role } = req.body;

  if (!token) return res.status(403).send("Sorğu məlumatları yalnışdır");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.userId);
    const user = await User.findById(user_id);
    if (!admin) return res.status(404).send("İstifadəçi tapılmadı.");
    if (admin.role !== "admin")
      return res.status(404).send("Sizin bu əməliyyat üçün icazəniz yoxdur.");
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");

    user.role = role;
    await user.save();

    res.send({
      message: `${user.name} ${
        user.surname
      } adlı istifadəçinin rolu dəyişdirildi. İstifadəçi artıq ${
        user.role === "admin" ? "Admindir" : "Admin deyil"
      }`,
    });
  } catch (error) {
    res.status(500).send("Xəta: " + error.message);
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, email, otp } = req.body;
  const token = req.headers.authorization;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).send("İstifadəçi tapılmadı.");

      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(401).send("Əvvəlki şifrə yalnışdır.");
      }

      user.password = bcrypt.hashSync(newPassword, 10);
      await user.save();
      res.send("Şifrə uğurla dəyişdirildi");
    } catch (error) {
      res.status(500).send("Xəta changePassword: " + error.message);
    }
  } else if (email && otp) {
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send("İstifadəçi tapılmadı.");

      if (user.otp !== otp) return res.status(401).send("OTP kodu yalnışdır");

      user.password = bcrypt.hashSync(newPassword, 10);
      user.otp = null;
      await user.save();

      res.send("Şifrə uğurla dəyişdirildi");
    } catch (error) {
      res.status(500).send("Xəta: " + error.message);
    }
  } else {
    res.status(400).send("Xəta: changePassword" + error.message);
  }
};

const deleteUserAccount = async (req, res) => {
  const { otp } = req.body;
  const token = req.headers.authorization;

  if (!token) return res.status(403).send("Sorğu məlumatları yalnışdır");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");

    if (user.otp !== otp) return res.status(401).send("OTP kodu yalnışdır.");

    await User.findByIdAndDelete(user._id);

    res.send("İstifadəçi uğurla silindi.");
  } catch (error) {
    res.status(500).send("Xəta: deleteUserAccount" + error.message);
  }
};

const sendResetPasswordOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");

    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    user.otp = otp;
    await user.save();

    sendOTPToEmail(email, otp);
    res.send(`OTP kodu ${email} elektron poçtuna göndərildi.`);
  } catch (error) {
    res.status(500).send("Xəta: sendRequestPasswordOTP " + error.message);
  }
};

const deactivateUser = async (req, res) => {
  const { email } = req.body;
  const token = req.headers.authorization;

  if (!token) return res.status(403).send("Sorğu məlumatları yalnışdır");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");
    if (
      String(user.email).toLocaleLowerCase() !==
      String(email).toLocaleLowerCase()
    )
      return res.status(404).send("Elektron poçt düzgün deyil");

    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    user.otp = otp;
    await user.save();

    sendOTPToEmail(email, otp);
    res.send(`OTP kodu ${email} elektron poçtuna göndərildi.`);
  } catch (error) {
    res.status(500).send("Xəta: deactivateUser" + error.message);
  }
};

const confirmUserDeactivation = async (req, res) => {
  const { otp } = req.body;
  const token = req.headers.authorization;

  if (!token) return res.status(403).send("Sorğu məlumatları yalnışdır");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");

    if (user.otp !== otp) return res.status(401).send("OTP kodu yalnışdır");

    user.isActive = false;
    user.otp = null;
    await user.save();

    res.send("İstifadəçi profili deaktiv edildi");
  } catch (error) {
    res.status(500).send("Xəta: confirmUserDeactivation" + error.message);
  }
};

const reactivateUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");
    if (user.isActive) return res.status(400).send("İstifadəçi artıq aktivdir");

    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    user.otp = otp;
    await user.save();

    sendOTPToEmail(email, otp);
    res.send(`OTP kodu ${email} elektron poçtuna göndərildi.`);
  } catch (error) {
    res.status(500).send("Xəta: reactivateUser" + error.message);
  }
};

const confirmUserReactivation = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");

    if (user.otp !== otp) return res.status(401).send("OTP kodu yalnışdır");

    user.isActive = true;
    user.otp = null;
    await user.save();

    res.send("İstifadəçi aktivləşdirildi. Zəhmət olmasa hesabınıza daxil olun.");
  } catch (error) {
    res.status(500).send("Xəta: confirmUserReactivation" + error.message);
  }
};

const sendDeleteAccountOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("İstifadəçi tapılmadı.");

    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    user.otp = otp;
    await user.save();

    sendOTPToEmail(email, otp);
    res.send(`OTP kodu ${email} elektron poçtuna göndərildi.`);
  } catch (error) {
    res.status(500).send("Xəta: sendDeleteAccountOTP" + error.message);
  }
};

const getAllUserList = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).send("Sorğu məlumatları yalnışdır");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).send("Sizin bu əməliyyat üçün icazəniz yoxdur.");
    }

    const users = await User.find();
    const data = users.map((item) => ({
      _id: item._id,
      name: item.name,
      surname: item.surname,
      email: item.email,
      profileImage: item.profileImage,
      role: item.role,
      phone: item.phone,
      address: item.address,
      age: item.age,
      registerDate: item.registerDate,
      isActive: item.isActive,
    }));
    res.send(data);
  } catch (error) {
    res.status(500).send("Xəta: getAllUserList" + error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOTP,
  changeProfileImage,
  getUserProfileData,
  updateProfileData,
  confirmUserDeactivation,
  reactivateUser,
  confirmUserReactivation,
  changeUserRole,
  deactivateUser,
  getAllUserList,
  changePassword,
  sendResetPasswordOTP,
  deleteUserAccount,
  sendDeleteAccountOTP,
};
