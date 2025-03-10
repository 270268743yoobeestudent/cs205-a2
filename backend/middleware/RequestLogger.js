// Request Logging Middleware
const requestLogger = (req, res, next) => {
    console.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next(); // Move to the next middleware/route
  };
  
  module.exports = requestLogger;
  