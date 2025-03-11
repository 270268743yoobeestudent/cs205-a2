const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const { isAuthenticated, isAdmin } = require("../middleware/AuthMiddleware");

// Middleware to ensure admin access
router.use(isAuthenticated, isAdmin);

// Get all users (Admin only)
router.get("/users", async (req, res, next) => {
  try {
    const users = await adminController.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
});

// Get all reports (Admin only)
router.get("/reports", async (req, res, next) => {
  try {
    const reports = await adminController.getAllReports();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    next(error);
  }
});

// Get a specific employee's report (Admin only)
router.get("/reports/:employeeId", async (req, res, next) => {
  try {
    const report = await adminController.getEmployeeReport(req.params.employeeId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error("Error fetching employee report:", error);
    next(error);
  }
});

module.exports = router;
