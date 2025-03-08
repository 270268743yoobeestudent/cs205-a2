const validateQuizInput = (req, res, next) => {
    const { moduleId, questions } = req.body;
  
    // Ensure required fields are present
    if (!moduleId || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Module ID and at least one question are required.' });
    }
  
    // Ensure each question has at least two options
    for (const question of questions) {
      if (!question.options || question.options.length < 2) {
        return res.status(400).json({ message: 'Each question must have at least two options.' });
      }
    }
  
    // Proceed if validation is successful
    next();
  };
  
  module.exports = validateQuizInput;
  