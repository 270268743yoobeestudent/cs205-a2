const requestLogger = (req, res, next) => {
  const start = Date.now(); // Capture the start time to log response time
  
  // Log request details (method, URL, and IP)
  console.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  // Once the response is sent, log the status code and response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });

  next(); // Pass control to the next middleware
};

module.exports = requestLogger;
