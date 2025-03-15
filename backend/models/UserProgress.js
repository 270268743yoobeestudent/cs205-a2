// models/Progress.js
const mongoose = require('mongoose');

// Define the schema for tracking user progress
const progressSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the user
  completedModules: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TrainingModule' 
  }], // Modules the user has completed
  quizScores: [
    {
      quiz: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz' 
      }, // The quiz the score relates to
      score: { 
        type: Number, 
        required: true 
      }, // The user's score for that quiz
    },
  ],
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }, // Timestamp of when the progress was last updated
});

// Add an index on 'user' for faster lookups
progressSchema.index({ user: 1 });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
