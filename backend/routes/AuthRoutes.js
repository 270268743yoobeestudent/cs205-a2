const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { isAuthenticated, isAdmin } = require("../middleware/AuthMiddleware");
const validateRegister = require("../middleware/ValidateRegister");
const router = express.Router();

/**
 * Register a new user (employee or admin)
 * POST /api/auth/register
 */
router.post("/register", validateRegister, async (req, res, next) => {
  const { username, firstName, lastName, email, password, role } = req.body;

  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Create a new user
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password,
      role: role || "employee",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error); // Forward error to centralized error handler
  }
});

/**
 * Login a user
 * POST /api/auth/login
 */
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Save user data to session
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.session.user, // Return session details
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error); // Forward error to centralized error handler
  }
});

/**
 * Logout a user
 * POST /api/auth/logout
 */
router.post("/logout", isAuthenticated, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }

    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ success: true, message: "Logout successful" });
  });
});

/**
 * Get current user's profile (protected)
 * GET /api/auth/profile
 */
router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: req.session.user, // User data comes from session
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    next(error); // Forward error to centralized error handler
  }
});

/**
 * Admin-only test route
 * GET /api/auth/admin
 */
router.get("/admin", isAuthenticated, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome, Admin!",
  });
});

module.exports = router;
