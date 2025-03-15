// models/User.js
const mongoose = require('mongoose');

// Define schema for users
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Username is required and should be unique for each user
  password: { 
    type: String, 
    required: true 
  }, // Password is required
  role: { 
    type: String, 
    enum: ['admin', 'employee'], 
    default: 'employee' 
  }, // Role of the user (either 'admin' or 'employee'). Default is 'employee'
  completedModules: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TrainingModule' 
  }], // Array of modules the user has completed. Each entry is a reference to the TrainingModule model
  quizScores: [
    {
      quiz: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz' 
      }, // Reference to the quiz
      score: { 
        type: Number, 
        required: true 
      }, // The score the user achieved in the quiz
    }
  ],
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
