const mongoose = require("mongoose");

/**
 * Middleware to validate input for report operations
 * Validates employeeId and quizScores (if provided) in the request.
 */
const validateReportInput = (req, res, next) => {
  const { employeeId } = req.params; // Retrieve employeeId from route parameters
  const { quizScores } = req.body; // Retrieve quizScores from the request body

  // Validate employeeId as a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Employee ID format.",
    });
  }

  // If quizScores is provided, validate its structure
  if (quizScores !== undefined) {
    if (!Array.isArray(quizScores) || quizScores.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one quiz score is required.",
      });
    }

    // Validate each quiz score in the array
    for (let i = 0; i < quizScores.length; i++) {
      const score = quizScores[i];

      // Validate quizId
      if (!score.quizId || !mongoose.Types.ObjectId.isValid(score.quizId)) {
        return res.status(400).json({
          success: false,
          message: `Valid Quiz ID is required for score at index ${i + 1}.`,
        });
      }

      // Validate score
      if (typeof score.score !== "number" || score.score < 0) {
        return res.status(400).json({
          success: false,
          message: `Valid score (non-negative number) is required for quiz at index ${i + 1}.`,
        });
      }

      // Ensure score is not greater than totalQuestions
      if (score.score > score.totalQuestions) {
        return res.status(400).json({
          success: false,
          message: `Score cannot be greater than total questions for quiz at index ${i + 1}.`,
        });
      }

      // Validate totalQuestions
      if (typeof score.totalQuestions !== "number" || score.totalQuestions <= 0) {
        return res.status(400).json({
          success: false,
          message: `Valid totalQuestions (greater than 0) is required for quiz at index ${i + 1}.`,
        });
      }
    }
  }

  // Proceed if all validations pass
  next();
};

module.exports = validateReportInput;
