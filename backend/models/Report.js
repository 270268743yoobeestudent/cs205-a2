const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  // Reference to the employee (User model)
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Employee ID is required"],  // Descriptive error message
  },

  // Array of modules the employee has completed
  completedModules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "Completed modules are required"],  // Ensures modules are required
    },
  ],

  // Array of quiz scores with details for each quiz taken
  quizScores: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: [true, "Quiz ID is required"],  // Descriptive error message
      },
      score: {
        type: Number,
        required: [true, "Quiz score is required"],  // Ensures the score is required
      },
      totalQuestions: {
        type: Number,
        required: [true, "Total questions are required"],  // Ensures total questions are recorded
      },
      dateTaken: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // List of weak areas identified based on quiz scores
  improvementAreas: {
    type: [String],
    default: [],  // Default as empty array
  },

  // Last updated timestamp
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
module.exports = mongoose.model("Report", ReportSchema);
