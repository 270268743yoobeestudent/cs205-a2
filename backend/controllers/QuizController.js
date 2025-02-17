// controllers/QuizesController.js

const Quiz = require('../models/Quiz');

// Create a new quiz for a training module
exports.createQuiz = async (req, res) => {
  try {
    const { module, questions } = req.body;
    const newQuiz = new Quiz({ module, questions });
    await newQuiz.save();
    res.status(201).json({ success: true, data: newQuiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    // Populate the module field to include module details if needed
    const quizzes = await Quiz.find().populate('module');
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single quiz by its ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('module');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
