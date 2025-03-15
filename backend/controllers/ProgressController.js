// controllers/ProgressController.js

const Progress = require('../models/Progress'); // Import Progress model
const User = require('../models/User'); // Import User model
const TrainingModule = require('../models/TrainingModule'); // Import TrainingModule model
const Quiz = require('../models/Quiz'); // Import Quiz model

// Track and update progress
exports.trackProgress = async (req, res) => {
  try {
    const userId = req.session.user._id; // Get user ID from session
    let progress = await Progress.findOne({ user: userId }); // Find the progress record for the user

    // If no progress data exists, create a new progress entry
    if (!progress) {
      progress = new Progress({ user: userId });
      await progress.save(); // Save the new progress record
    }

    // Populate completed modules and quiz scores
    await progress.populate('completedModules').populate('quizScores.quiz');

    // Return the user's progress data
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve progress', error }); // Error handling
  }
};

// Update progress (when a module is completed or quiz is taken)
exports.updateProgress = async (req, res) => {
  try {
    const { moduleId, quizId, score } = req.body; // Get data from request body
    const userId = req.session.user._id; // Get user ID from session

    // Ensure the moduleId or quizId is provided and valid
    if (!moduleId && !quizId) {
      return res.status(400).json({ message: 'Module ID or Quiz ID must be provided.' }); // Error if neither is provided
    }

    // Find or create a progress record for the user
    let progress = await Progress.findOne({ user: userId });
    if (!progress) {
      progress = new Progress({ user: userId });
    }

    let updated = false; // Flag to track whether progress was updated

    // Update completed modules if the module is completed
    if (moduleId && !progress.completedModules.includes(moduleId)) {
      const moduleExists = await TrainingModule.findById(moduleId); // Check if the module exists
      if (!moduleExists) {
        return res.status(404).json({ message: 'Training Module not found.' }); // Error if module doesn't exist
      }
      progress.completedModules.push(moduleId); // Add module to completedModules
      updated = true; // Flag that the progress was updated
    }

    // Update quiz scores if a quiz score is provided
    if (quizId && score !== undefined) {
      const quizExists = await Quiz.findById(quizId); // Check if the quiz exists
      if (!quizExists) {
        return res.status(404).json({ message: 'Quiz not found.' }); // Error if quiz doesn't exist
      }

      const existingQuizScore = progress.quizScores.find(
        (quizScore) => quizScore.quiz.toString() === quizId
      ); // Check if the quiz score already exists for this quiz

      if (existingQuizScore) {
        existingQuizScore.score = score; // Update the existing score
      } else {
        progress.quizScores.push({ quiz: quizId, score }); // Add new quiz score
      }
      updated = true; // Flag that the progress was updated
    }

    // Only update lastUpdated field if progress was changed
    if (updated) {
      progress.lastUpdated = Date.now(); // Set lastUpdated to the current time
      await progress.save(); // Save the updated progress record
    }

    res.status(200).json({ message: 'Progress updated successfully', progress }); // Return the updated progress
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress', error }); // Error handling
  }
};
