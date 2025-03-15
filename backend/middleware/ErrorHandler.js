const errorHandler = (err, req, res, next) => {
  // Log the error with more context (especially useful in development)
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error occurred in ${req.method} ${req.originalUrl}`);
    console.error(err.stack); // Log stack trace for debugging
  } else {
    // In production, log only the error message for security reasons
    console.error(err.message);
  }

  // Handle different types of errors more specifically
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: err.errors,
    });
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Invalid ObjectId format',
    });
  }

  // Handle 404 errors explicitly
  if (err.status === 404) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: err.message || 'Resource not found',
    });
  }

  // Default to a generic server error if no specific handling is found
  res.status(err.status || 500).json({
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
