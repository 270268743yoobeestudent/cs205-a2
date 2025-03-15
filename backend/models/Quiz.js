// models/Quiz.js
const mongoose = require('mongoose');

// Define schema for individual quiz questions
const questionSchema = new mongoose.Schema({
  questionText: { 
    type: String, 
    required: true 
  }, // The text of the question
  options: [{ 
    type: String, 
    required: true 
  }], // List of options for the question
  correctAnswer: { 
    type: String, 
    required: true 
  }, // The correct answer from the options
});

// Define schema for the quiz itself
const quizSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  }, // Title of the quiz
  trainingModule: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TrainingModule', 
    required: true 
  }, // Reference to the associated training module
  questions: [questionSchema], // Array of questions for the quiz
  createdAt: { 
    type: Date, 
    default: Date.now 
  }, // When the quiz was created
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }, // When the quiz was last updated
});

// Create the Quiz model from the schema
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
