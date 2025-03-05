const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");

// Existing route to get all reports
router.get("/reports", adminController.getAllReports);

// Existing route to get an employee's report
router.get("/reports/:employeeId", adminController.getEmployeeReport);

// New route to get an employee's progress
router.get("/progress/:employeeId", adminController.getEmployeeProgress);

module.exports = router;
