// controllers/QuizController.js
const Quiz = require('../models/Quiz');

// Create a new quiz (admin only)
exports.createQuiz = async (req, res) => {
  const { title, trainingModule, questions } = req.body;

  try {
    const newQuiz = new Quiz({
      title,
      trainingModule,
      questions,
    });

    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (err) {
    res.status(500).json({ message: 'Error creating quiz', error: err.message });
  }
};

// Get a single quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('trainingModule', 'title');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving quiz', error: err.message });
  }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('trainingModule', 'title');
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving quizzes', error: err.message });
  }
};

// Update an existing quiz (admin only)
exports.updateQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { title, trainingModule, questions } = req.body;

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { title, trainingModule, questions, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (err) {
    res.status(500).json({ message: 'Error updating quiz', error: err.message });
  }
};

// Delete a quiz (admin only)
exports.deleteQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting quiz', error: err.message });
  }
};