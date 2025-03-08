const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, isAdmin } = require('../middleware/AuthMiddleware');
const router = express.Router();

// Register new user or admin
router.post('/register', async (req, res) => {
  // Registration logic (from previous explanation)
});

// Login user
router.post('/login', async (req, res) => {
  // Login logic (from previous explanation)
});

// Protect routes for authenticated users
router.get('/me', authenticateToken, async (req, res) => {
  // Fetch user details
});

// Admin-only route for managing users
router.get('/admin/users', authenticateToken, isAdmin, async (req, res) => {
  // Fetch users (for admin only)
});

module.exports = router;
