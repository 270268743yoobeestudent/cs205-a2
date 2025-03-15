// backend/models/TrainingModule.js
const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  header: { type: String, required: true },
  content: { type: String, required: true }
});

const TrainingModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  contentSections: [SectionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrainingModule', TrainingModuleSchema);
