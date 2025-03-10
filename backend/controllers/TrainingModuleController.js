const TrainingModule = require("../models/TrainingModule");

/**
 * Create a new training module
 */
const createModule = async (moduleData) => {
  try {
    const newModule = new TrainingModule(moduleData); // Create a new instance of the model
    await newModule.save(); // Save the new module to the database
    return newModule; // Return the newly created module
  } catch (error) {
    console.error("Error creating module in controller:", error);
    throw new Error("Failed to create training module"); // Throw error to be handled in the route
  }
};

/**
 * Retrieve all training modules
 */
const getModules = async () => {
  try {
    const modules = await TrainingModule.find(); // Fetch all training modules
    return modules;
  } catch (error) {
    console.error("Error retrieving modules in controller:", error);
    throw new Error("Failed to fetch training modules"); // Throw error to be handled in the route
  }
};

/**
 * Retrieve a single training module by ID
 */
const getModuleById = async (id) => {
  try {
    const module = await TrainingModule.findById(id); // Fetch module by ID
    if (!module) {
      throw new Error("Training module not found"); // Handle case where module doesn't exist
    }
    return module;
  } catch (error) {
    console.error("Error retrieving module by ID in controller:", error);
    throw new Error("Failed to fetch training module by ID"); // Throw error to be handled in the route
  }
};

module.exports = {
  createModule,
  getModules,
  getModuleById,
};
