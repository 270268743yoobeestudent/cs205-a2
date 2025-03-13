const TrainingModule = require('../models/TrainingModule');

const addTrainingModule = async (moduleData) => {
  try {
    // Validate that content is properly structured as an array
    if (!Array.isArray(moduleData.content) || moduleData.content.length === 0) {
      throw new Error('Content must be an array with at least one block');
    }

    // Validate that each content block has a heading and body
    for (const block of moduleData.content) {
      if (!block.heading || !block.body) {
        throw new Error('Each content block must contain both heading and body');
      }
    }

    // Create a new training module with the validated data
    const newModule = new TrainingModule(moduleData);
    await newModule.save();
    return newModule;
  } catch (error) {
    console.error("Error saving training module:", error);
    throw new Error('Error saving training module');
  }
};

// Edit a training module
const editTrainingModule = async (id, moduleData) => {
  try {
    const updatedModule = await TrainingModule.findByIdAndUpdate(id, moduleData, { new: true });
    return updatedModule;
  } catch (error) {
    console.error("Error updating training module:", error);
    throw new Error('Error updating training module');
  }
};

// Delete a training module
const deleteTrainingModule = async (id) => {
  try {
    const deletedModule = await TrainingModule.findByIdAndDelete(id);
    return deletedModule;
  } catch (error) {
    console.error("Error deleting training module:", error);
    throw new Error('Error deleting training module');
  }
};

// Get all training modules
const getAllTrainingModules = async () => {
  try {
    const modules = await TrainingModule.find();
    return modules;
  } catch (error) {
    console.error("Error fetching training modules:", error);
    throw new Error('Error fetching training modules');
  }
};

// Get a training module by ID
const getTrainingModuleById = async (id) => {
  try {
    const module = await TrainingModule.findById(id);
    return module;
  } catch (error) {
    console.error("Error fetching training module by ID:", error);
    throw new Error('Error fetching module by ID');
  }
};

// Mark a module as completed (for user)
const markModuleAsCompleted = async (userId, moduleId) => {
  // Assume you have a user schema with a `completedModules` field
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Add the module ID to the completedModules array if not already added
    if (!user.completedModules.includes(moduleId)) {
      user.completedModules.push(moduleId);
      await user.save();
    }

    return { success: true };
  } catch (error) {
    console.error("Error marking module as completed:", error);
    throw new Error('Error marking module as completed');
  }
};

module.exports = {
  addTrainingModule,
  editTrainingModule,
  deleteTrainingModule,
  getAllTrainingModules,
  getTrainingModuleById,
  markModuleAsCompleted,
};
