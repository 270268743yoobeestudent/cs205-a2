const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust the path if needed
const router = express.Router();

/**
 * Register a new user (employee or admin)
 * POST /api/auth/register
 */
router.post("/register", async (req, res, next) => {
  const { username, password, role } = req.body;

  try {
    // Validate request body
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: "User already exists." 
      }); // Conflict
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || "employee", // Default role is "employee"
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    next(error); // Forward error to the centralized error handler
  }
});

/**
 * Login a user
 * POST /api/auth/login
 */
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Validate request body
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Generate a JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    next(error); // Forward error to the centralized error handler
  }
});

module.exports = router;
