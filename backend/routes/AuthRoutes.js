const express = require("express");
const { login, register, logout, validateSession } = require("../controllers/AuthController");
const { isAuthenticated, isAdmin, hasRole } = require("../middleware/AuthMiddleware");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate Limiting for Login and Register Routes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `windowMs`
  message: "Too many login attempts, please try again later",
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `windowMs`
  message: "Too many registration attempts, please try again later",
});

/**
 * Login a user
 * POST /api/auth/login
 */
router.post("/login", loginLimiter, login);

/**
 * Register a user with validation
 * POST /api/auth/register
 */
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role").isIn(["admin", "employee", "manager"]).withMessage("Valid role is required"),
  ],
  (req, res) => {
    // Validate input data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    register(req, res); // Proceed to the controller after validation passes
  }
);

/**
 * Logout a user
 * POST /api/auth/logout
 */
router.post("/logout", isAuthenticated, logout);

/**
 * Validate session and get current user role
 * GET /api/auth/session
 */
router.get("/session", validateSession);

/**
 * Admin-only access (test route)
 * GET /api/auth/admin
 */
router.get("/admin", isAuthenticated, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome, Admin!",
  });
});

/**
 * Shared resource route for multiple roles
 * GET /api/auth/shared-resource
 */
router.get("/shared-resource", isAuthenticated, hasRole("admin", "employee"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Accessible to admins and employees!",
  });
});

module.exports = router;
