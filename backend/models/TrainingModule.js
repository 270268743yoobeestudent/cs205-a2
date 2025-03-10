const mongoose = require('mongoose');

const TrainingModuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Module name is required'], // Added a more descriptive error message
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Module description is required'], // Added a more descriptive error message
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Middleware example for additional future-proofing (optional)
TrainingModuleSchema.pre('save', function (next) {
  // Any custom logic before saving can be added here
  next();
});

// Exporting the model
module.exports = mongoose.model('TrainingModule', TrainingModuleSchema);
