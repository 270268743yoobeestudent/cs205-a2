const express = require('express');
const userController = require('../controllers/UserController'); // Importing the user controller
const { isAuthenticated } = require('../middleware/AuthMiddleware'); // Importing authentication middleware

const router = express.Router();

// User Registration
router.post('/register', userController.registerUser); // Route to register a new user

// User Login
router.post('/login', userController.loginUser); // Route for user login

// User Logout
router.post('/logout', isAuthenticated, userController.logoutUser); // Route for user logout, requires authentication

// Get User Progress
router.get('/progress', isAuthenticated, userController.getUserProgress); // Route to get the user's progress, requires authentication

// Update Completed Module
router.post('/progress/completed-module', isAuthenticated, userController.updateCompletedModule); // Route to update completed module for the user

// Update Quiz Score
router.post('/progress/quiz-score', isAuthenticated, userController.updateQuizScore); // Route to update quiz score for the user

module.exports = router; // Exporting the router to be used in the application
