const mongoose = require('mongoose');

// Question schema for each individual question in a quiz
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],  // More descriptive error message
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v) {
        return v.length >= 2; // Ensures there are at least 2 options
      },
      message: 'There should be at least two options for each question.',
    },
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],  // More descriptive error message
  },
});

// Quiz schema with reference to a training module
const QuizSchema = new mongoose.Schema({
  // Relate each quiz to a specific training module
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingModule',
    required: [true, 'Module reference is required'],
  },
  questions: {
    type: [QuestionSchema],
    required: [true, 'Quiz must have questions'],
    validate: {
      validator: function(v) {
        return v.length > 0; // Ensure there is at least one question in the quiz
      },
      message: 'A quiz must contain at least one question.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Exporting the Quiz model to be used in other files
module.exports = mongoose.model('Quiz', QuizSchema);
