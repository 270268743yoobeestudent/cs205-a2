const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const { authenticateToken, isAdmin } = require("../middleware/AuthMiddleware");
const validateReportInput = require("../middleware/ValidateReportInput");
const checkObjectId = require("../middleware/CheckObjectId"); // Middleware for ID validation

// Apply middleware to authenticate token and restrict access to admins
router.use(authenticateToken, isAdmin);

/**
 * Route: Get a specific employee's report
 * Method: GET
 * Endpoint: /api/reports/:employeeId
 */
router.get("/:employeeId", validateReportInput, checkObjectId("employeeId"), async (req, res, next) => {
  try {
    // Fetch the report for the specific employee
    await ReportController.getEmployeeReport(req, res);
  } catch (error) {
    next(error); // Forward error to centralised error handler
  }
});

/**
 * Route: Update an employee's report
 * Method: PUT
 * Endpoint: /api/reports/:employeeId
 */
router.put("/:employeeId", validateReportInput, checkObjectId("employeeId"), async (req, res, next) => {
  try {
    // Update the report for the specific employee
    await ReportController.updateEmployeeReport(req, res);
  } catch (error) {
    next(error); // Forward error to centralised error handler
  }
});

/**
 * Route: Delete an employee's report
 * Method: DELETE
 * Endpoint: /api/reports/:employeeId
 */
router.delete("/:employeeId", validateReportInput, checkObjectId("employeeId"), async (req, res, next) => {
  try {
    // Delete the report for the specific employee
    await ReportController.deleteEmployeeReport(req, res);
  } catch (error) {
    next(error); // Forward error to centralised error handler
  }
});

module.exports = router;
