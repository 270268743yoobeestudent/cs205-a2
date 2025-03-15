// backend/routes/employee.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// All employee routes are protected by the isEmployee middleware
router.use(employeeController.isEmployee);

router.get('/modules', employeeController.getAvailableModules);
router.get('/quizzes/all', employeeController.getAllQuizzes); // for quiz list
router.get('/quizzes/:quizId', employeeController.getQuizById); // for fetching a quiz by ID
router.post('/quizzes', employeeController.submitQuiz);
router.get('/progress', employeeController.getPersonalProgress);
router.post('/modules/completed', employeeController.markModuleCompleted);

module.exports = router;
