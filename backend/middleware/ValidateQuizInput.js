const validateQuizInput = (req, res, next) => {
  const { moduleId, questions } = req.body;

  // Ensure moduleId is provided and is a valid string or number
  if (!moduleId || (typeof moduleId !== 'string' && typeof moduleId !== 'number')) {
    return res.status(400).json({ message: 'Valid Module ID is required and should be a string or number.' });
  }

  // Ensure questions is an array and contains at least one question
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: 'At least one question is required.' });
  }

  // Ensure each question has options and at least two options
  for (const [index, question] of questions.entries()) {
    if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
      return res.status(400).json({
        message: `Question ${index + 1} must have at least two options.`
      });
    }

    // Optional: Ensure each question has a valid format (e.g., question text and correct answer)
    if (!question.question || typeof question.question !== 'string') {
      return res.status(400).json({
        message: `Question ${index + 1} must have a valid question text.`
      });
    }

    if (!question.correctAnswer || !question.options.includes(question.correctAnswer)) {
      return res.status(400).json({
        message: `Question ${index + 1} must have a valid correct answer that is one of the options.`
      });
    }
  }

  // Proceed if all validations pass
  next();
};

module.exports = validateQuizInput;
