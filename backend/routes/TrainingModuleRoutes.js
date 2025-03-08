const express = require('express');
const router = express.Router();
const TrainingModuleController = require('../controllers/TrainingModuleController');
const authenticateToken = require('../middleware/AuthMiddleware'); // Correct import for authentication
const validateModuleInput = require('../middleware/ValidateModuleInput'); // Optional: validation middleware

// Route to create a new training module (Admin Only)
router.post('/', authenticateToken, validateModuleInput, async (req, res) => {
  try {
    // Call the controller function to create a new module
    const newModule = await TrainingModuleController.createModule(req.body);
    res.status(201).json(newModule); // Return the newly created module
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to retrieve all training modules (Admin Only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const modules = await TrainingModuleController.getModules();
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to retrieve a single module by its ID (Admin Only)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const module = await TrainingModuleController.getModuleById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    console.error('Error fetching module by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
