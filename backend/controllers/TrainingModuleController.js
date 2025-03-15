const TrainingModule = require('../models/TrainingModule'); // Import the TrainingModule model

// Create a new training module
const createTrainingModule = async (req, res) => {
  try {
    const { title, description, content, quiz } = req.body;

    const newModule = new TrainingModule({
      title,
      description,
      content,
      quiz,
    });

    await newModule.save();
    res.status(201).json({ message: 'Training module created successfully', module: newModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create module', error });
  }
};

// Get all training modules for admins
const getAllModules = async (req, res) => {
  try {
    const modules = await TrainingModule.find();
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve modules', error });
  }
};

// Get a single training module by ID
const getTrainingModule = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await TrainingModule.findById(id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve module', error });
  }
};

// Update a training module by ID
const updateTrainingModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, quiz } = req.body;

    const updatedModule = await TrainingModule.findByIdAndUpdate(
      id,
      { title, description, content, quiz },
      { new: true }
    );

    if (!updatedModule) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json({ message: 'Module updated successfully', module: updatedModule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update module', error });
  }
};

// Delete a training module (admin only)
const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await TrainingModule.findByIdAndDelete(id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete module', error });
  }
};

// Export the functions correctly
module.exports = {
  createTrainingModule,
  getAllModules,
  getTrainingModule,
  updateTrainingModule,
  deleteModule,
};
