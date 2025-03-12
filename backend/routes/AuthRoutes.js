const express = require("express");
const { login, register, logout, validateSession } = require("../controllers/AuthController");
const { isAuthenticated, isAdmin, hasRole } = require("../middleware/AuthMiddleware");

const router = express.Router();

/**
 * Login a user
 * POST /api/auth/login
 */
router.post("/login", login);

/**
 * Register a user (optional feature)
 * POST /api/auth/register
 */
router.post("/register", register);

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
