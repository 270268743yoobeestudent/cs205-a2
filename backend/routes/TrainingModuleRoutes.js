// routes/TrainingModuleRoutes.js

const express = require('express');
const router = express.Router();
const TrainingModuleController = require('../controllers/TrainingModuleController');

// Route to create a new training module
router.post('/', TrainingModuleController.createModule);

// Route to retrieve all training modules
router.get('/', TrainingModuleController.getModules);

// Route to retrieve a single module by its ID
router.get('/:id', TrainingModuleController.getModuleById);

module.exports = router;
