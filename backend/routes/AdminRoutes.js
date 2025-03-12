const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const { isAuthenticated, isAdmin } = require("../middleware/AuthMiddleware");

// Middleware to ensure admin access
router.use(isAuthenticated, isAdmin);

/**
 * Route: Fetch all users (admins and employees)
 * Method: GET
 * Endpoint: /api/admin/users
 */
router.get("/users", adminController.getAllUsers);

/**
 * Route: Fetch all reports
 * Method: GET
 * Endpoint: /api/admin/reports
 */
router.get("/reports", adminController.getAllReports);

/**
 * Route: Fetch a specific employee's report
 * Method: GET
 * Endpoint: /api/admin/reports/:employeeId
 */
router.get("/reports/:employeeId", adminController.getEmployeeReport);

// Add a new user
router.post("/users", adminController.addUser);

module.exports = router;
