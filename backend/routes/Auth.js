const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/AuthMiddleware'); // Importing the authentication and admin middleware
const authController = require('../controllers/AuthController'); // Controller for authentication actions
const userController = require('../controllers/UserController'); // Controller for user actions
const router = express.Router();

// Authentication Routes
router.post('/login', authController.loginUser); // Login route - triggers login function in AuthController
router.post('/logout', authController.logoutUser); // Logout route - triggers logout function in AuthController

// Admin Route to Create User (using adminMiddleware to restrict to admins only)
router.post('/create-user', adminMiddleware, userController.registerUser); // Creates a new user. Only accessible to admins

module.exports = router; // Exports the router for use in other files
