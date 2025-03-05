const mongoose = require("mongoose");

const TrainingModuleSchema = new mongoose.Schema({
  // Title of the training module
  title: {
    type: String,
    required: [true, "Title is required"],  // Descriptive error message
    trim: true,  // Trims any leading/trailing spaces
    minlength: [3, "Title must be at least 3 characters long"],  // Optional: Add min length validation
  },

  // Content of the training module (main learning material)
  content: {
    type: String,
    required: [true, "Content is required"],  // Ensures content is provided
    minlength: [10, "Content must be at least 10 characters long"],  // Optional: Add min length validation for content
  },

  // Additional optional field to provide context about the module
  description: {
    type: String,
    trim: true,  // Ensure no extra spaces
  },

  // Optional: Category/Type of the module (e.g., "Phishing Awareness", "Password Security")
  category: {
    type: String,
    enum: ["Phishing Awareness", "Password Security", "Safe Internet Habits"], // Example categories
  },

  // Date when the module was created
  createdAt: {
    type: Date,
    default: Date.now,  // Default is the current date and time
  },

  // Last updated timestamp
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` field whenever the module is modified
TrainingModuleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();  // Set updatedAt to current time before saving
  next();
});

module.exports = mongoose.model("TrainingModule", TrainingModuleSchema);
