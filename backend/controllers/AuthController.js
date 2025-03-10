const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming the User model is correctly located

const SALT_ROUNDS = 10; // Define salt rounds as a constant for password hashing

/**
 * User Login Controller
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token (including user role for authorization purposes)
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload includes user ID and role
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send token as an HTTP-only cookie (better security practices)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure flag in production
      sameSite: 'Strict', // Prevent cross-site request forgery (CSRF) attacks
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * User Registration Controller
 */
exports.register = async (req, res) => {
  const { email, password, name, role = 'user' } = req.body; // Default role is 'user'

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // Set the user role
    });

    // Save the new user to the database
    await newUser.save();

    // Create JWT token for the new user
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get User Profile (Requires Authentication)
 */
exports.getProfile = async (req, res) => {
  try {
    // Retrieve the user from the database by the ID in the token
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Profile Retrieval Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
