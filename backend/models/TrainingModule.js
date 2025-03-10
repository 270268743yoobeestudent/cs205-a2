const mongoose = require('mongoose');

const TrainingModuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const TrainingModule = mongoose.model('TrainingModule', TrainingModuleSchema);

module.exports = TrainingModule;
