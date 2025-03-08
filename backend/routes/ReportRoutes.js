const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// Middleware to authenticate the token and check if the user is an admin
router.use(authenticateToken, isAdmin);

// Route to get all reports (Admin Only)
router.get("/", ReportController.getAllReports);

// Route to get a specific employee's report (Admin Only)
router.get("/:employeeId", ReportController.getEmployeeReport);

// Route to get filtered reports (e.g., reports with completed modules)
router.get("/filter/completed", ReportController.getFilteredReports);

// Route to update an employee's report (e.g., add quiz scores)
router.put("/:employeeId", ReportController.updateEmployeeReport);

// Route to delete an employee's report
router.delete("/:employeeId", ReportController.deleteEmployeeReport);

module.exports = router;
