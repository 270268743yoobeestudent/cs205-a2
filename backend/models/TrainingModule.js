const mongoose = require('mongoose');

const TrainingModuleSchema = new mongoose.Schema(
  {
    title: { // Replaced 'name' with 'title'
      type: String,
      required: [true, 'Module title is required'], // Updated error message to reflect 'title'
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Module description is required'], // Retained descriptive error message
      trim: true,
    },
    content: [
      {
        heading: { type: String, required: true }, // Each content block must have a heading
        body: { type: String, required: true }, // Each content block must have a body
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Middleware example for additional future-proofing (optional)
TrainingModuleSchema.pre('save', function (next) {
  // Any custom logic before saving can be added here
  console.log('Saving training module:', this);
  next();
});

// Exporting the model
module.exports = mongoose.model('TrainingModule', TrainingModuleSchema);
