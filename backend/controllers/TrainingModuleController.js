// controllers/TrainingModuleController.js

const TrainingModule = require('../models/TrainingModule');

// Create a new training module
exports.createModule = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newModule = new TrainingModule({ title, content });
    await newModule.save();
    res.status(201).json({ success: true, data: newModule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all training modules
exports.getModules = async (req, res) => {
  try {
    const modules = await TrainingModule.find();
    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single training module by ID
exports.getModuleById = async (req, res) => {
  try {
    const module = await TrainingModule.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    res.status(200).json({ success: true, data: module });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
