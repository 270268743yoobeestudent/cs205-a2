const mongoose = require('mongoose');

// Question schema for each individual question in a quiz
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'], // Descriptive error message
    trim: true, // Trim leading/trailing spaces
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length === 4; // Ensure exactly 4 options for each question
      },
      message: 'Each question must have exactly 4 options.',
    },
  },
  correctAnswer: {
    type: Number, // Index of the correct answer in the options array
    required: [true, 'Correct answer index is required'], // Descriptive error message
    validate: {
      validator: function (v) {
        return v >= 0 && v < this.options.length; // Ensure the index is within the options array range
      },
      message: 'Correct answer index must refer to one of the options.',
    },
  },
});

// Quiz schema with reference to a training module
const QuizSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingModule',
      required: [true, 'Module reference is required'], // Relate quiz to a training module
    },
    title: {
      type: String,
      required: [true, 'Quiz title is required'], // Title of the quiz
      trim: true,
    },
    questions: {
      type: [QuestionSchema],
      required: [true, 'Quiz must have questions'],
      validate: {
        validator: function (v) {
          return v.length > 0; // Ensure at least one question in the quiz
        },
        message: 'A quiz must contain at least one question.',
      },
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Adding an index to optimize queries based on the training module
QuizSchema.index({ module: 1 });

// Middleware to update `updatedAt` field before saving
QuizSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Exporting the Quiz model to be used in other files
module.exports = mongoose.model('Quiz', QuizSchema);
