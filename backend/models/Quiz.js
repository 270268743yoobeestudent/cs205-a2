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
        return v.length >= 2; // Ensures there are at least 2 options
      },
      message: 'There should be at least two options for each question.',
    },
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'], // Descriptive error message
    validate: {
      validator: function (v) {
        // Ensure the answer is one of the options
        return this.options.includes(v);
      },
      message: 'Answer must be one of the provided options.',
    },
    trim: true, // Trim leading/trailing spaces
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
