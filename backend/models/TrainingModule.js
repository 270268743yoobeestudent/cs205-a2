// models/TrainingModule.js

const mongoose = require('mongoose');

const TrainingModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  // Additional fields such as a module description or category can be added here
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TrainingModule', TrainingModuleSchema);