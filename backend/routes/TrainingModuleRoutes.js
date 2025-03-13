const express = require('express');
const router = express.Router();
const TrainingModuleController = require('../controllers/TrainingModuleController');
const { isAuthenticated, isAdmin } = require('../middleware/AuthMiddleware');

// Admin only: Route to create a new training module
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, content } = req.body;

    // Validate content (should be an array with at least one object)
    if (!Array.isArray(content) || content.length === 0) {
      return res.status(400).json({ message: 'Content must be an array with at least one block' });
    }

    // Call the addTrainingModule function from the controller
    const newModule = await TrainingModuleController.addTrainingModule({ title, description, content });
    res.status(201).json({ message: 'Training module added successfully', newModule });
  } catch (error) {
    console.error("Error creating training module:", error);
    res.status(500).json({ message: 'Error adding training module' });
  }
});

// Admin only: Route to update an existing training module
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content } = req.body;

    // Validate content
    if (!Array.isArray(content) || content.length === 0) {
      return res.status(400).json({ message: 'Content must be an array with at least one block' });
    }

    const updatedModule = await TrainingModuleController.editTrainingModule(id, { title, description, content });
    if (!updatedModule) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json({ message: 'Training module updated successfully', updatedModule });
  } catch (error) {
    console.error("Error updating training module:", error);
    res.status(500).json({ message: 'Error editing training module' });
  }
});

// Admin only: Route to delete a training module
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedModule = await TrainingModuleController.deleteTrainingModule(id);
    if (!deletedModule) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json({ message: 'Training module deleted successfully' });
  } catch (error) {
    console.error("Error deleting training module:", error);
    res.status(500).json({ message: 'Error deleting training module' });
  }
});

// Public route: Retrieve all training modules
router.get('/', async (req, res) => {
  try {
    const modules = await TrainingModuleController.getAllTrainingModules();
    res.status(200).json({ message: 'Modules fetched successfully', modules });
  } catch (error) {
    console.error("Error fetching training modules:", error);
    res.status(500).json({ message: 'Error fetching training modules' });
  }
});

// Public route: Retrieve a single module by its ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const module = await TrainingModuleController.getTrainingModuleById(id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json({ message: 'Module fetched successfully', module });
  } catch (error) {
    console.error("Error fetching module by ID:", error);
    res.status(500).json({ message: 'Error fetching module by ID' });
  }
});

// User only: Mark a module as completed
router.post('/mark-completed', isAuthenticated, async (req, res) => {
  try {
    const { userId, moduleId } = req.body;
    const result = await TrainingModuleController.markModuleAsCompleted(userId, moduleId);
    res.status(200).json({ message: 'Module marked as completed', result });
  } catch (error) {
    console.error("Error marking module as completed:", error);
    res.status(500).json({ message: 'Error marking module as completed' });
  }
});

module.exports = router;
