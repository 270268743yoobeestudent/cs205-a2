const mongoose = require("mongoose");

const validateQuizInput = (req, res, next) => {
  const { module, title, questions } = req.body;

  // Validate module ID
  if (!module || !mongoose.Types.ObjectId.isValid(module)) {
    return res.status(400).json({
      success: false,
      message: "A valid Module ID is required.",
    });
  }

  // Validate title
  if (!title || typeof title !== "string" || title.trim().length < 5 || title.trim().length > 100) {
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
    // Validate question text
    if (!question.question || typeof question.question !== "string" || question.question.length < 5 || question.question.length > 500) {
      errors.push(`Question ${index + 1} must have a valid text (5-500 characters).`);
    }

    // Validate options
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      errors.push(`Question ${index + 1} must have exactly 4 options.`);
    } else if (!question.options.every((option) => typeof option === "string" && option.trim().length > 0)) {
      errors.push(`Question ${index + 1} has invalid options. Each option must be a non-empty string.`);
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
