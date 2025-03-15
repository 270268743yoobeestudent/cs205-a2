const express = require('express');
const progressController = require('../controllers/ProgressController'); // Importing the controller for handling progress actions
const { isAuthenticated } = require('../middleware/AuthMiddleware'); // Importing the authentication middleware

const router = express.Router();

// Employee Routes
// Route to get employee's progress (GET request)
router.get('/progress', isAuthenticated, progressController.trackProgress); // Requires authentication

// Route to update employee's progress (POST request) - This route will likely need to be refined
router.post('/progress/update-module', isAuthenticated, progressController.updateCompletedModule); // Updating module completion status
router.post('/progress/update-quiz', isAuthenticated, progressController.updateQuizScore); // Updating quiz score

module.exports = router; // Exports the router to be used in other parts of the application
