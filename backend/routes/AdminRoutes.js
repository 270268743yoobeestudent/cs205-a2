const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const { isAuthenticated, isAdmin } = require("../middleware/AuthMiddleware");
const mongoose = require("mongoose");

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
router.get("/reports/:employeeId", (req, res, next) => {
  const { employeeId } = req.params;

  if (!mongoose.isValidObjectId(employeeId)) {
    return res.status(400).json({ message: "Invalid employee ID format." });
  }

  adminController.getEmployeeReport(req, res, next);
});

/**
 * Route: Add a new user
 * Method: POST
 * Endpoint: /api/admin/users
 */
router.post("/users", async (req, res) => {
  const { username, password, firstName, lastName, email, role } = req.body;

  try {
    // Validate fields
    if (!username || !password || !email || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Call the controller to add user
    await adminController.addUser(req, res);
  } catch (error) {
    console.error("User creation failed:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

/**
 * Route: Fetch all employees
 * Method: GET
 * Endpoint: /api/admin/employees
 */
router.get("/employees", adminController.getAllEmployees);

/**
 * Route: Fetch progress for a specific employee
 * Method: GET
 * Endpoint: /api/admin/progress/:employeeId
 */
router.get("/progress/:employeeId", (req, res, next) => {
  const { employeeId } = req.params;

  if (!mongoose.isValidObjectId(employeeId)) {
    return res.status(400).json({ message: "Invalid employee ID format." });
  }

  adminController.getEmployeeProgress(req, res, next);
});

module.exports = router;
