const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const { authenticateToken, isAdmin } = require("../middleware/AuthMiddleware");
const validateReportInput = require("../middleware/ValidateReportInput"); // Import middleware
const checkObjectId = require("../middleware/CheckObjectId");


// Middleware to authenticate the token and check if the user is an admin
router.use(authenticateToken, isAdmin);

// Route to get a specific employee's report (Admin Only)
router.get("/:employeeId", validateReportInput, async (req, res, next) => {
  try {
    await ReportController.getEmployeeReport(req, res);
  } catch (error) {
    next(error);
  }
});

// Route to update an employee's report (Admin Only)
router.put("/:employeeId", validateReportInput, async (req, res, next) => {
  try {
    await ReportController.updateEmployeeReport(req, res);
  } catch (error) {
    next(error);
  }
});

// Route to delete an employee's report (Admin Only)
router.delete("/:employeeId", validateReportInput, async (req, res, next) => {
  try {
    await ReportController.deleteEmployeeReport(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
