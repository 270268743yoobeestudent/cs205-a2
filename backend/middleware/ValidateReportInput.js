const mongoose = require("mongoose");

const validateReportInput = (req, res, next) => {
  const { employeeId } = req.params; // Get employeeId from route parameters
  const { quizScores } = req.body;

  // Validate employeeId as a MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: "Invalid Employee ID format." });
  }

  // If quizScores is provided (only relevant for updating reports), validate it
  if (quizScores !== undefined) {
    if (!Array.isArray(quizScores) || quizScores.length === 0) {
      return res.status(400).json({ message: "At least one quiz score is required." });
    }

    // Ensure each quiz score contains valid data
    for (let i = 0; i < quizScores.length; i++) {
      const score = quizScores[i];

      if (!score.quizId) {
        return res.status(400).json({ message: `Quiz ID is required for score at index ${i + 1}.` });
      }
      if (typeof score.score !== "number" || score.score < 0) {
        return res.status(400).json({ message: `Valid score is required for quiz at index ${i + 1}.` });
      }
      if (score.score > score.totalQuestions) {
        return res.status(400).json({
          message: `Score cannot be greater than total questions for quiz at index ${i + 1}.`,
        });
      }
      if (!score.totalQuestions || typeof score.totalQuestions !== "number") {
        return res.status(400).json({ message: `Total number of questions is required for quiz at index ${i + 1}.` });
      }
    }
  }

  // Proceed if validation is successful
  next();
};

module.exports = validateReportInput;
