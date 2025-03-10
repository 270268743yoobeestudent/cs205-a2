/**
 * Middleware to validate quiz input
 * Ensures that a valid module ID and properly formatted questions are provided.
 */
const validateQuizInput = (req, res, next) => {
  const { moduleId, questions } = req.body;

  // Validate moduleId
  if (!moduleId || (typeof moduleId !== "string" && typeof moduleId !== "number")) {
    return res.status(400).json({
      success: false,
      message: "Valid Module ID is required and should be a string or number.",
    });
  }

  // Validate questions array
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one question is required.",
    });
  }

  // Validate each question
  for (const [index, question] of questions.entries()) {
    // Check for at least two options
    if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
      return res.status(400).json({
        success: false,
        message: `Question ${index + 1} must have at least two options.`,
      });
    }

    // Check for a valid question text
    if (!question.question || typeof question.question !== "string") {
      return res.status(400).json({
        success: false,
        message: `Question ${index + 1} must have a valid question text.`,
      });
    }

    // Check for a valid correctAnswer within options
    if (!question.correctAnswer || !question.options.includes(question.correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: `Question ${index + 1} must have a valid correct answer that is one of the options.`,
      });
    }
  }

  // Proceed to the next middleware or route handler if validation passes
  next();
};

module.exports = validateQuizInput;
