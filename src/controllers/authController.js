const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists!" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
      otp,
    });

    // Send OTP email
    await sendEmail(email, "Your OTP Verification Code", `Your OTP is ${otp}`);

    res.status(201).json({ message: "Signup successful! Please verify your email with the OTP sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during signup", error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    user.isVerified = true;
    user.otp = null; // Clear OTP after verification
    await user.save();

    res.status(200).json({ message: "Account verified successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your account before logging in." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Generate Refresh Token (optional for long sessions)
    const refreshToken = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // Refresh token expires in 7 days
    );

    res.status(200).json({
      message: "Login successful!",
      token, // Access token
      refreshToken, // Refresh token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newToken = jwt.sign(
      { id: decoded.id, userType: decoded.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // New access token
    );

    res.status(200).json({ token: newToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired refresh token." });
  }
};