// backend/controllers/employeeController.js
const TrainingModule = require('../models/TrainingModule');
const Quiz = require('../models/Quiz');
const UserProgress = require('../models/UserProgress');

// Middleware to allow only employees
exports.isEmployee = (req, res, next) => {
  if (req.session && req.session.role === 'employee') {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorised: Employees only' });
  }
};

// Get available training modules
exports.getAvailableModules = async (req, res) => {
  try {
    const modules = await TrainingModule.find();
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuiz = async (req, res) => {
    try {
      // For demonstration, get the first quiz available.
      const quiz = await Quiz.findOne();
      if (!quiz) return res.status(404).json({ message: "No quiz found" });
      res.json(quiz);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) score++;
    });
    const passed = score >= quiz.passingScore;
    let progress = await UserProgress.findOne({ userId: req.session.userId, moduleId: quiz.moduleId });
    if (!progress) {
      progress = new UserProgress({ userId: req.session.userId, moduleId: quiz.moduleId, quizResults: [] });
    }
    progress.quizResults.push({ quizId, score, passed });
    await progress.save();
    res.json({ message: 'Quiz submitted', score, passed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// backend/controllers/employeeController.js
exports.getPersonalProgress = async (req, res) => {
    try {
      const progress = await UserProgress.find({ userId: req.session.userId })
        .populate('moduleId');
      res.json(progress);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Mark module as completed
exports.markModuleCompleted = async (req, res) => {
  const { moduleId } = req.body;
  try {
    let progress = await UserProgress.findOne({ userId: req.session.userId, moduleId });
    if (!progress) {
      progress = new UserProgress({ userId: req.session.userId, moduleId, completionStatus: true });
    } else {
      progress.completionStatus = true;
    }
    await progress.save();
    res.json({ message: 'Module marked as completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
