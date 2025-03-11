const TrainingModule = require("../models/TrainingModule");

/**
 * Create a new training module
 */
const createModule = async (moduleData) => {
  try {
    console.log("Creating training module with data:", moduleData); // Log incoming data for debugging
    const newModule = new TrainingModule(moduleData); // Create a new instance of the model
    const savedModule = await newModule.save(); // Save the new module to the database
    console.log("Successfully created training module:", savedModule); // Log the saved module
    return savedModule; // Return the newly created module
  } catch (error) {
    console.error("Error creating module in controller:", error.message); // Improved error logging
    throw new Error("Failed to create training module"); // Throw error to be handled in the route
  }
};

/**
 * Retrieve all training modules
 */
const getModules = async () => {
  try {
    console.log("Fetching all training modules..."); // Log action for debugging
    const modules = await TrainingModule.find(); // Fetch all training modules
    console.log("Successfully retrieved training modules:", modules); // Log retrieved modules
    return modules;
  } catch (error) {
    console.error("Error retrieving modules in controller:", error.message); // Improved error logging
    throw new Error("Failed to fetch training modules"); // Throw error to be handled in the route
  }
};

/**
 * Retrieve a single training module by ID
 */
const getModuleById = async (id) => {
  try {
    console.log("Fetching training module with ID:", id); // Log action for debugging
    const module = await TrainingModule.findById(id); // Fetch module by ID
    if (!module) {
      console.warn("Training module not found for ID:", id); // Warn if not found
      throw new Error("Training module not found"); // Handle case where module doesn't exist
    }
    console.log("Successfully retrieved training module:", module); // Log retrieved module
    return module;
  } catch (error) {
    console.error("Error retrieving module by ID in controller:", error.message); // Improved error logging
    throw new Error("Failed to fetch training module by ID"); // Throw error to be handled in the route
  }
};

module.exports = {
  createModule,
  getModules,
  getModuleById,
};
