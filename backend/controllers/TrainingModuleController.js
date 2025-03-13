const TrainingModule = require('../models/TrainingModule');
const User = require('../models/User');

// Add a new training module (admin only)
exports.addTrainingModule = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    // Validate request body
    if (!title || !description || !content) {
      return res.status(400).json({ message: 'Title, description, and content are required' });
    }

    const newModule = new TrainingModule({ title, description, content });
    await newModule.save();

    res.status(201).json({ message: 'Training module added successfully', newModule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding training module' });
  }
};

// Edit a training module (admin only)
exports.editTrainingModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content } = req.body;

    // Validate request body
    if (!title || !description || !content) {
      return res.status(400).json({ message: 'Title, description, and content are required' });
    }

    const module = await TrainingModule.findById(id);
    if (!module) {
      return res.status(404).json({ message: 'Training module not found' });
    }

    module.title = title;
    module.description = description;
    module.content = content;

    await module.save();
    res.status(200).json({ message: 'Training module updated successfully', module });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error editing training module' });
  }
};

// Delete a training module (admin only)
exports.deleteTrainingModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await TrainingModule.findById(id);
    if (!module) {
      return res.status(404).json({ message: 'Training module not found' });
    }

    await module.remove();
    res.status(200).json({ message: 'Training module deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting training module' });
  }
};

// Get all training modules (for users and admins)
exports.getAllTrainingModules = async (req, res) => {
  try {
    const modules = await TrainingModule.find();
    res.status(200).json(modules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching training modules' });
  }
};

// Get a single training module by ID
exports.getTrainingModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await TrainingModule.findById(id);
    if (!module) {
      return res.status(404).json({ message: 'Training module not found' });
    }
    res.status(200).json(module);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching training module' });
  }
};

// Mark module as completed (user only)
exports.markModuleAsCompleted = async (req, res) => {
  try {
    const { userId, moduleId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.completedModules.includes(moduleId)) {
      return res.status(400).json({ message: 'Module already marked as completed' });
    }

    user.completedModules.push(moduleId);
    await user.save();
    res.status(200).json({ message: 'Module marked as completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking module as completed' });
  }
};
