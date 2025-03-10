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
    validate: {
      validator: function(v) {
        // Ensure the answer is one of the options
        return this.options.includes(v);
      },
      message: 'Answer must be one of the provided options.',
    },
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
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

// Adding an index to `module` to optimize queries based on training module
QuizSchema.index({ module: 1 });

// Exporting the Quiz model to be used in other files
module.exports = mongoose.model('Quiz', QuizSchema);
