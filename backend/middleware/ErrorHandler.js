const errorHandler = (err, req, res, next) => {
  // Log the error details for debugging purposes
  console.error("Error:", err.message);
  console.error("Stack Trace:", err.stack); // Log the stack trace for debugging

  // Check if the error has a status code, otherwise default to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Prepare a more detailed error response
  const errorResponse = {
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }) // Show stack trace only in development environment
  };

  // Send the error response with appropriate status code
  res.status(statusCode).json(errorResponse);

  // Optionally, you could send errors to a logging service (e.g., Sentry, LogRocket) in production
};

module.exports = errorHandler;
