const express = require("express");
const { signup, verifyOtp, login } = require("../controllers/authController");

const router = express.Router();

// Signup route
router.post("/signup", signup);

// OTP verification route
router.post("/verify-otp", verifyOtp);

// Login route
router.post("/login", login);

module.exports = router;
