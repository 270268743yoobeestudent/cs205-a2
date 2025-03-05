// routes/QuizRoutes.js

const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');

// Route to create a new quiz
router.post('/', QuizController.createQuiz);

// Route to retrieve all quizzes
router.get('/', QuizController.getQuizzes);

// Route to retrieve a single quiz by its ID
router.get('/:id', QuizController.getQuizById);

module.exports = router;
