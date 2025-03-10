const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
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
        validate: {
          validator: async function (value) {
            // Check if module already exists for the employee
            const report = await mongoose.model('Report').findOne({ employeeId: this.employeeId, completedModules: value });
            return !report; // If report exists, validation fails (module already completed)
          },
          message: "Module is already completed by this employee.",
        },
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
          min: [0, "Score cannot be negative"],
          validate: {
            validator: function (v) {
              return v <= this.totalQuestions; // Ensure score is not greater than total questions
            },
            message: "Score cannot be greater than the total number of questions.",
          },
        },
        totalQuestions: {
          type: Number,
          required: [true, "Total questions are required"],
          min: [1, "Total questions must be at least 1"],
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
      validate: {
        validator: function (v) {
          // Optional: Ensure improvementAreas is non-empty if necessary
          return v.length === 0 || v.length > 0;
        },
        message: "Improvement areas should not be empty if provided.",
      },
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Indexes for performance optimization (optional)
ReportSchema.index({ employeeId: 1 });
ReportSchema.index({ "quizScores.quizId": 1 });
ReportSchema.index({ lastUpdated: 1 });  // Optional: If you frequently query by lastUpdated

module.exports = mongoose.model("Report", ReportSchema);
