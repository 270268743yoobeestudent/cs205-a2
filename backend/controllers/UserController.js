const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { isAuthenticated } = require('../middleware/AuthMiddleware');

// Register a new user (admin or employee)
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// User login (using sessions)
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    // Set user session
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    res.status(200).send('Login successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
};

// Logout user
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }
    res.status(200).send('Logged out successfully');
  });
};

// Get user progress (completed modules and quiz scores)
const getUserProgress = async (req, res) => {
  try {
    // Ensure the user is authenticated using the session
    if (!req.session.user) {
      return res.status(403).send('User is not authenticated');
    }

    const user = await User.findById(req.session.user.id)
      .populate('completedModules quizScores.quiz');

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({
      completedModules: user.completedModules,
      quizScores: user.quizScores,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user progress');
  }
};

// Update completed module for user
const updateCompletedModule = async (req, res) => {
  const { moduleId } = req.body;

  try {
    // Ensure the user is authenticated using the session
    if (!req.session.user) {
      return res.status(403).send('User is not authenticated');
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if module already completed
    if (user.completedModules.includes(moduleId)) {
      return res.status(400).send('Module already completed');
    }

    // Add module to completed list
    user.completedModules.push(moduleId);
    await user.save();

    res.status(200).send('Module marked as completed');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating completed module');
  }
};

// Update quiz score for user
const updateQuizScore = async (req, res) => {
  const { quizId, score } = req.body;

  try {
    // Ensure the user is authenticated using the session
    if (!req.session.user) {
      return res.status(403).send('User is not authenticated');
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const existingScore = user.quizScores.find((item) => item.quiz.toString() === quizId);
    if (existingScore) {
      existingScore.score = score; // Update the score if the quiz was already taken
    } else {
      user.quizScores.push({ quiz: quizId, score });
    }

    await user.save();

    res.status(200).send('Quiz score updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating quiz score');
  }
};

// Export all functions
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProgress,
  updateCompletedModule,
  updateQuizScore,
};
