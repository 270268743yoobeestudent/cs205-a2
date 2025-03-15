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

// Get all quizzes for employees
exports.getAllQuizzes = async (req, res) => {
  try {
    // Populate moduleId so that the module title is available
    const quizzes = await Quiz.find().populate('moduleId');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a quiz by its ID for attempting
exports.getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate('moduleId');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
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
      const correct = question.correctAnswer.trim().toLowerCase();
      const given = (answers[index] || "").trim().toLowerCase();
      if (correct === given) score++;
    });
    const passed = score >= quiz.passingScore;
    
    // Find or create a progress record for the current user for this quiz’s module
    let progress = await UserProgress.findOne({ user: req.session.userId, moduleId: quiz.moduleId });
    if (!progress) {
      progress = new UserProgress({ user: req.session.userId, moduleId: quiz.moduleId, quizScores: [] });
    }
    progress.quizScores.push({ quiz: quizId, score });
    await progress.save();
    
    res.json({ message: 'Quiz submitted', score, passed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get personal progress (existing endpoint)
exports.getPersonalProgress = async (req, res) => {
  try {
    console.log('Fetching personal progress for user:', req.session.userId);
    const progress = await UserProgress.find({ user: req.session.userId })
      .populate('completedModules')
      .populate({
        path: 'quizScores.quiz',
        populate: { path: 'moduleId' }
      });
    console.log('Found progress:', progress);
    res.json(progress);
  } catch (err) {
    console.error('Error in getPersonalProgress:', err);
    res.status(500).json({ error: err.message });
  }
};

// Mark module as completed
exports.markModuleCompleted = async (req, res) => {
  try {
    console.log('markModuleCompleted request body:', req.body);
    console.log('Session userId:', req.session.userId);
    
    const { moduleId } = req.body;
    if (!moduleId) {
      console.error("Module ID not provided in request body.");
      return res.status(400).json({ message: 'Module ID is required' });
    }
    
    if (!req.session.userId) {
      console.error("No user session found.");
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    let progress = await UserProgress.findOne({ user: req.session.userId });
    
    if (!progress) {
      progress = new UserProgress({
        user: req.session.userId,
        completedModules: [moduleId]
      });
      console.log('Created new progress record with completedModules:', progress.completedModules);
    } else {
      if (!progress.completedModules.some(id => String(id) === String(moduleId))) {
        progress.completedModules.push(moduleId);
        console.log('Added moduleId to existing progress record:', moduleId);
      } else {
        console.log('Module already marked as completed.');
      }
      progress.lastUpdated = Date.now();
    }
    
    await progress.save();
    console.log('Progress record saved:', progress);
    res.json({ message: 'Module marked as completed' });
  } catch (err) {
    console.error('Error in markModuleCompleted:', err);
    res.status(500).json({ error: err.message });
  }
};
