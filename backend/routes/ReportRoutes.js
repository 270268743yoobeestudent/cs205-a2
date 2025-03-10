const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const { authenticateToken, isAdmin } = require("../middleware/AuthMiddleware");
const validateReportInput = require("../middleware/ValidateReportInput");
const checkObjectId = require("../middleware/CheckObjectId"); // Middleware for ID validation

// Apply middleware to authenticate token and restrict access to admins
router.use(authenticateToken, isAdmin);

// Route to get a specific employee's report (Admin only)
router.get("/:employeeId", validateReportInput, checkObjectId("employeeId"), async (req, res, next) => {
  try {
    await ReportController.getEmployeeReport(req, res);
  } catch (error) {
    next(error); // Forward error to centralized error handler
  }
});

// Route to update an employee's report (Admin only)
router.put("/:employeeId", validateReportInput, checkObjectId("employeeId"), async (req, res, next) => {
  try {
    await ReportController.updateEmployeeReport(req, res);
  } catch (error) {
    next(error);
  }
});

// Route to delete an employee's report (Admin only)
router.delete("/:employeeId", validateReportInput, checkObjectId("employeeId"), async (req, res, next) => {
  try {
    await ReportController.deleteEmployeeReport(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
