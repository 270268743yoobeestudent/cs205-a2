const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Employee ID is required"],
  },

  completedModules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "Completed modules are required"],
      unique: true,  // Ensure module uniqueness
    },
  ],

  quizScores: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: [true, "Quiz ID is required"],
      },
      score: {
        type: Number,
        required: [true, "Quiz score is required"],
      },
      totalQuestions: {
        type: Number,
        required: [true, "Total questions are required"],
      },
      dateTaken: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  improvementAreas: {
    type: [String],
    default: [],
  },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance optimization (optional)
ReportSchema.index({ employeeId: 1 });
ReportSchema.index({ "quizScores.quizId": 1 });

module.exports = mongoose.model("Report", ReportSchema);
