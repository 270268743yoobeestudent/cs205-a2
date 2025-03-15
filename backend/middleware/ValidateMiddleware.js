const { body, validationResult } = require('express-validator');

// Validation middleware for creating a training module
const validateTrainingModule = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5 }).withMessage('Title should be at least 5 characters long'),
  
  body('content')
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 20 }).withMessage('Content should be at least 20 characters long'),
  
  // Check if there are validation errors and handle accordingly
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }
    next();
  }
];

// Export the validation middleware
module.exports = { validateTrainingModule };
