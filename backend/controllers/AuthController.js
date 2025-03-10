const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // User model

const SALT_ROUNDS = 10; // Number of salt rounds for hashing passwords

/**
 * User Login Controller
 */
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT token with userId and role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
      sameSite: "Strict", // Prevent CSRF attacks
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    next(error); // Forward error to centralized handler
  }
};

/**
 * User Registration Controller
 */
exports.register = async (req, res, next) => {
  const { email, password, name, role = "employee" } = req.body; // Default role is "employee"

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token for the registered user
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    next(error); // Forward error to centralized handler
  }
};

/**
 * Get User Profile (Requires Authentication)
 */
exports.getProfile = async (req, res, next) => {
  try {
    // Retrieve the user from the database using the userId from the token
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Profile Retrieval Error:", error);
    next(error); // Forward error to centralized handler
  }
};

/**
 * User Logout Controller
 */
exports.logout = (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "Strict",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};
