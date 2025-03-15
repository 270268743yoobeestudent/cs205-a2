const session = require('express-session');

// Session middleware for handling authentication
module.exports.setupSession = (app) => {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret', // Use environment variable for session secret
    resave: false,  // Don't resave session if not modified
    saveUninitialized: true, // Store session even if not modified
    cookie: {
      httpOnly: true, // Helps prevent XSS attacks
      secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // Session expiration: 24 hours
    },
  }));
};

// Middleware to check if the user is authenticated
module.exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).send('User is not authenticated. Please log in.');
  }
  next(); // Proceed to next middleware or route handler
};

// Middleware to check if the user is an admin
module.exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next(); // Proceed if the user is an admin
  }
  return res.status(403).send('Access denied. Admin privileges required.');
};
