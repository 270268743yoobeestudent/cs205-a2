const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

// Middleware to check if the user is authenticated
const authenticateToken = async (req, res, next) => {
  // Check if the token is provided in the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify the token using the JWT_SECRET from the environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to the request object for use in other middleware or route handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle invalid token errors
    return res.status(400).json({ message: 'Invalid token.', error: err.message });
  }
};

module.exports = authenticateToken;
