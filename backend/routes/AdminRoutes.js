const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const { authenticateToken, isAdmin } = require("../middleware/AuthMiddleware");

// Middleware to protect routes (only admins can access)
router.use(authenticateToken);
router.use(isAdmin);

// Route to get all reports (Admin only)
router.get("/reports", async (req, res, next) => {
  try {
    const reports = await adminController.getAllReports();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
});

// Route to get an employee's report
router.get("/reports/:employeeId", async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: "Employee ID is required" });
    }

    const report = await adminController.getEmployeeReport(employeeId);
    if (!report) {
      return res.status(404).json({ success: false, message: "Employee report not found" });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
});

// Route to get an employee's progress
router.get("/progress/:employeeId", async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: "Employee ID is required" });
    }

    const progress = await adminController.getEmployeeProgress(employeeId);
    if (!progress) {
      return res.status(404).json({ success: false, message: "Employee progress not found" });
    }

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
