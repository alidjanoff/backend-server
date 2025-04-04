const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendOTP,
  changeProfileImage,
  getUserProfileData,
  deactivateUser,
  confirmUserDeactivation,
  updateProfileData,
  getAllUserList,
  reactivateUser,
  changeUserRole,
  confirmUserReactivation,
  changePassword,
  sendResetPasswordOTP,
  deleteUserAccount,
  sendDeleteAccountOTP,
} = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/users/send-otp", sendOTP);

router.put("/users/profile", changeProfileImage);

router.get("/users/profile-data", getUserProfileData);

router.put("/users/profile-update", updateProfileData);

router.post("/users/deactivate-user", deactivateUser);

router.post("/users/deactivate-user-confirm", confirmUserDeactivation);

router.post("/users/change-role", changeUserRole);

router.get("/users/get-all-users", getAllUserList);

router.post("/users/reactivate-user", reactivateUser);

router.post("/users/reactivate-user-confirm", confirmUserReactivation);

router.post("/users/change-password", changePassword);

router.post("/users/send-reset-password-otp", sendResetPasswordOTP);

router.post("/users/delete-account", deleteUserAccount);

router.post("/users/send-delete-account-otp", sendDeleteAccountOTP);

module.exports = router;
