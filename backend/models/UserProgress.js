// models/UserProgress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  completedModules: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TrainingModule' 
  }],
  quizScores: [
    {
      quiz: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz' 
      },
      score: { 
        type: Number, 
        required: true 
      },
    },
  ],
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
});

// Add an index on 'user' for faster lookups
progressSchema.index({ user: 1 });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
