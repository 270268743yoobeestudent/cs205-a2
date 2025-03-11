const requestLogger = (req, res, next) => {
  console.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next middleware
};

module.exports = requestLogger;
