const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get user progress (for the current authenticated user)
exports.getUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("completedModules");  // Populate the completedModules field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const progress = {
      completedModules: user.completedModules.length, // Example: Counting completed modules
      totalModules: await User.countDocuments({}), // Just an example; replace with actual total
    };
    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ message: 'Error fetching user progress' });
  }
};

// Get the current user's profile
exports.getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).populate("completedModules");
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error('User profile fetch failed');
  }
};

// Update the current user's profile
exports.updateUserProfile = async (userId, userData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update fields in the user profile if they exist in the request body
    user.firstName = userData.firstName || user.firstName;
    user.lastName = userData.lastName || user.lastName;
    user.email = userData.email || user.email;
    user.role = userData.role || user.role;

    await user.save();
    return user;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error('User profile update failed');
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID (for admins)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("completedModules quizResults.quiz"); // Populate completedModules and quizResults if needed
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Create a new user with the provided data
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// User login (authentication)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await user.matchPassword(password); // Assuming matchPassword is a method in the User model
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = user.generateAuthToken(); // Assuming generateAuthToken generates JWT for user
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in user' });
  }
};
