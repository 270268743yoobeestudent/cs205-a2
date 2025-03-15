// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Protect all admin routes with isAdmin middleware
router.use(adminController.isAdmin);

// Employee routes
router.post('/employees', adminController.createEmployee);
router.get('/employees', adminController.getEmployees);
router.put('/employees/:id', adminController.updateEmployee);
router.delete('/employees/:id', adminController.deleteEmployee);

// Module routes
router.post('/modules', adminController.createModule);
router.get('/modules', adminController.getModules);
router.put('/modules/:id', adminController.updateModule);
router.delete('/modules/:id', adminController.deleteModule);

// Quiz routes
router.post('/quizzes', adminController.createQuiz);
router.get('/quizzes', adminController.getQuizzes);
router.put('/quizzes/:id', adminController.updateQuiz);
router.delete('/quizzes/:id', adminController.deleteQuiz);

// Report and progress routes
router.get('/reports', adminController.generateReport);
router.get('/progress', adminController.getAllProgress);

module.exports = router;
