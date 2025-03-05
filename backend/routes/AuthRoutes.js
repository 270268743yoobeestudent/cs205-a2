const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController'); // You can adjust the path if necessary
const authenticateToken = require('../middleware/AuthMiddleware'); // Middleware to authenticate the token

// Route for user login
router.post('/login', AuthController.login);

// Route for user registration
router.post('/register', AuthController.register);

// Route to check if the user is authenticated (Protected route)
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;
