// models/Quiz.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingModule', required: true },
  questions: [questionSchema],
  passingScore: { type: Number, required: true }
});

module.exports = mongoose.model('Quiz', quizSchema);
