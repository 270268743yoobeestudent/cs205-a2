const Quiz = require('../models/Quiz');
const Module = require('../models/TrainingModule');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { moduleId, questions } = req.body;

    // Validate input
    if (!moduleId || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Missing required fields or questions' });
    }

    // Check if the module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    // Create a new quiz
    const newQuiz = new Quiz({
      module: moduleId,
      questions,
    });

    // Save the quiz
    await newQuiz.save();

    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Retrieve all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('module', 'title');
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes', details: error.message });
  }
};

// Retrieve a single quiz by its ID
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate('module', 'title');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
