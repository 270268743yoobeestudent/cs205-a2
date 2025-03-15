const express = require('express');
const trainingModuleController = require('../controllers/TrainingModuleController'); // Importing the controller
const { isAuthenticated, isAdmin } = require('../middleware/AuthMiddleware'); // Importing authentication and admin middleware

const router = express.Router();

// Admin Routes
// Route to create a new training module (admin-only access)
router.post('/admin/modules', isAuthenticated, isAdmin, trainingModuleController.createModule);
// Route to get all training modules (admin-only access)
router.get('/admin/modules', isAuthenticated, isAdmin, trainingModuleController.getAllModules);
// Route to delete a specific training module (admin-only access)
router.delete('/admin/modules/:id', isAuthenticated, isAdmin, trainingModuleController.deleteModule);

// Employee Route
// Route to get modules available for the employee
router.get('/modules', isAuthenticated, trainingModuleController.getModulesForEmployee);

module.exports = router; // Exporting the router for use in the application
