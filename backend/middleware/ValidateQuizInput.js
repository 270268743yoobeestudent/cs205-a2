const mongoose = require("mongoose");

/**
 * Helper function to validate string length between a given range.
 */
const isValidStringLength = (str, min, max) => {
  return typeof str === "string" && str.trim().length >= min && str.trim().length <= max;
};

/**
 * Helper function to validate question options.
 */
const isValidOptions = (options) => {
  return Array.isArray(options) && options.length === 4 && options.every((option) => typeof option === "string" && option.trim().length > 0);
};

const validateQuizInput = (req, res, next) => {
  const { module, title, questions } = req.body;

  // Trim the inputs to remove leading and trailing spaces
  req.body.title = title ? title.trim() : '';

  // Validate module ID
  if (!module || !mongoose.Types.ObjectId.isValid(module)) {
    return res.status(400).json({
      success: false,
      message: "A valid Module ID is required.",
    });
  }

  // Validate title
  if (!title || !isValidStringLength(title, 5, 100)) {
    return res.status(400).json({
      success: false,
      message: "Quiz title must be a string between 5 and 100 characters.",
    });
  }

  // Validate questions array
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one question is required.",
    });
  }

  const errors = [];

  questions.forEach((question, index) => {
    const trimmedQuestionText = question.question ? question.question.trim() : '';

    // Validate question text
    if (!trimmedQuestionText || !isValidStringLength(trimmedQuestionText, 5, 500)) {
      errors.push(`Question ${index + 1} must have a valid text (5-500 characters).`);
    }

    // Validate options
    if (!isValidOptions(question.options)) {
      errors.push(`Question ${index + 1} must have exactly 4 valid options.`);
    }

    // Validate correctAnswer
    if (typeof question.correctAnswer !== "number" || question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
      errors.push(`Question ${index + 1} must have a valid 'correctAnswer' index within the options.`);
    }
  });

  // If there are validation errors, return them
  if (errors.length > 0) {
    console.error("Validation Errors:", errors); // Log for debugging
    return res.status(400).json({
      success: false,
      message: "Validation errors occurred in the quiz submission.",
      errors,
    });
  }

  // Proceed if validation passes
  next();
};

module.exports = validateQuizInput;
