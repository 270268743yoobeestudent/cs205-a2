const express = require('express');
const quizController = require('../controllers/QuizController'); // Importing the quiz controller
const { isAuthenticated, isAdmin } = require('../middleware/AuthMiddleware'); // Importing authentication and admin middleware

const router = express.Router();

// Admin Routes
// Route to create a quiz (admin-only access)
router.post('/admin/quizzes', isAuthenticated, isAdmin, quizController.createQuiz); 

// Route to delete a quiz by ID (admin-only access)
router.delete('/admin/quizzes/:id', isAuthenticated, isAdmin, quizController.deleteQuiz); 

// Employee Route
// Route to get quizzes for a specific module (requires authentication)
router.get('/quizzes/:moduleId', isAuthenticated, quizController.getQuizForModule);

module.exports = router; // Exports the router to be used in the application
