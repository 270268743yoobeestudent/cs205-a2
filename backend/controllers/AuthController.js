// controllers/AuthController.js

const User = require('../models/User'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body; // Use 'username' instead of 'email'

        // Find the user by username instead of email
        const user = await User.findOne({ username });

        // If user not found, return an error
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Compare the given password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Set session data for the logged-in user
        req.session.user = { id: user._id, role: user.role };

        // Return a success message with user session data
        res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Logout User
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

// Admin Check Middleware
exports.isAdmin = async (req, res, next) => {
    try {
        // Ensure user is authenticated before checking role
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ message: 'Unauthorized: Please log in first' });
        }

        // Fetch user from the session ID
        const user = await User.findById(req.session.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        // Proceed to the next middleware or controller if the user is an admin
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create User (Admin Only)
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username }); // Use 'username' instead of 'email'
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with hashed password
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user', // Default to 'user' role if not specified
        });

        // Save the new user to the database
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
