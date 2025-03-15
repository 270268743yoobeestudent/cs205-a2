// backend/models/Quiz.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true }
});

const QuizSchema = new mongoose.Schema({
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingModule', required: true },
  questions: [QuestionSchema],
  passingScore: { type: Number, required: true }
});

module.exports = mongoose.model('Quiz', QuizSchema);
