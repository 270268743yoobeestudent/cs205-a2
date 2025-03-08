const validateReportInput = (req, res, next) => {
    const { employeeId, quizScores } = req.body;
  
    // Ensure that the employeeId and quizScores are provided
    if (!employeeId || !quizScores || quizScores.length === 0) {
      return res.status(400).json({ message: 'Employee ID and quiz scores are required.' });
    }
  
    // Ensure each quiz score contains valid data
    quizScores.forEach(score => {
      if (!score.quizId || !score.score || !score.totalQuestions) {
        return res.status(400).json({ message: 'Each quiz score must include quizId, score, and totalQuestions.' });
      }
    });
  
    // Proceed if validation is successful
    next();
  };
  
  module.exports = validateReportInput;
  