// backend/models/TrainingModule.js
const mongoose = require('mongoose');

const TrainingModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrainingModule', TrainingModuleSchema);
