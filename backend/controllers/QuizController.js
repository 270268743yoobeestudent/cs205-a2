const Quiz = require('../models/Quiz');
const User = require('../models/User');

// Helper function to validate quiz body
const validateQuizBody = (title, questions) => {
  if (!title || !questions || questions.length === 0) {
    return 'Title and questions are required';
  }
  return null;
};

// Create a new quiz (admin only)
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    // Validate request body
    const error = validateQuizBody(title, questions);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const newQuiz = new Quiz({ title, questions });
    await newQuiz.save();

    res.status(201).json({ message: 'Quiz created successfully', newQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating quiz', error: error.message });
  }
};

// Edit an existing quiz (admin only)
exports.editQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, questions } = req.body;

    // Validate request body
    const error = validateQuizBody(title, questions);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    quiz.title = title;
    quiz.questions = questions;

    await quiz.save();
    res.status(200).json({ message: 'Quiz updated successfully', quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error editing quiz', error: error.message });
  }
};

// Delete a quiz (admin only)
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await quiz.remove();
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting quiz', error: error.message });
  }
};

// Get all quizzes (for users and admins)
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
  }
};

// Get a single quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching quiz', error: error.message });
  }
};

// Submit quiz answers (user only)
exports.submitQuiz = async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;

    // Ensure both user and quiz exist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Validate answers length matches the number of questions
    if (quiz.questions.length !== answers.length) {
      return res.status(400).json({ message: 'The number of answers does not match the number of questions' });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score++;
      }
    });

    // Save score in user record
    user.quizScores.push({ quizId, score });
    await user.save();

    res.status(200).json({ message: 'Quiz submitted successfully', score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting quiz', error: error.message });
  }
};
