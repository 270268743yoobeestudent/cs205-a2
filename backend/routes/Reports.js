const express = require('express');
const reportController = require('../controllers/ReportController'); // Importing the report controller
const { authMiddleware, adminMiddleware } = require('../middleware/AuthMiddleware'); // Importing authentication and admin middleware

const router = express.Router();

// Admin Routes
// Route to get all user progress reports (admin-only access)
router.get('/progress', authMiddleware, adminMiddleware, reportController.getAllProgress); 

// Route to get progress for a specific user by userId (admin-only access)
router.get('/user/:userId', authMiddleware, adminMiddleware, reportController.getUserProgress);

// Route to export the report (admin-only access)
router.get('/export', authMiddleware, adminMiddleware, reportController.exportReport); 

module.exports = router; // Exports the router to be used in the application
