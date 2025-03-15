const mongoose = require('mongoose');

const trainingModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
}, { timestamps: true }); // Automatically manages createdAt and updatedAt

const TrainingModule = mongoose.model('TrainingModule', trainingModuleSchema);

module.exports = TrainingModule;
