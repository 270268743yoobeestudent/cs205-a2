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
    console.error("Error creating module in controller:", error.message);
    throw new Error("Failed to create training module");
  }
};

/**
 * Retrieve all training modules
 */
const getModules = async () => {
  try {
    console.log("Fetching all training modules..."); // Log action for debugging
    const modules = await TrainingModule.find(); // Fetch all training modules
    console.log("Successfully retrieved training modules:", modules);
    return modules;
  } catch (error) {
    console.error("Error retrieving modules in controller:", error.message);
    throw new Error("Failed to fetch training modules");
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
      console.warn("Training module not found for ID:", id);
      throw new Error("Training module not found");
    }
    console.log("Successfully retrieved training module:", module);
    return module;
  } catch (error) {
    console.error("Error retrieving module by ID in controller:", error.message);
    throw new Error("Failed to fetch training module by ID");
  }
};

/**
 * Update an existing training module
 */
const updateModule = async (id, moduleData) => {
  try {
    console.log("Updating training module with ID:", id, "Data:", moduleData);
    const updatedModule = await TrainingModule.findByIdAndUpdate(id, moduleData, { new: true });
    if (!updatedModule) {
      console.warn("Training module not found for update with ID:", id);
      throw new Error("Training module not found for update");
    }
    console.log("Successfully updated training module:", updatedModule);
    return updatedModule;
  } catch (error) {
    console.error("Error updating module in controller:", error.message);
    throw new Error("Failed to update training module");
  }
};

/**
 * Delete a training module
 */
const deleteModule = async (id) => {
  try {
    console.log("Deleting training module with ID:", id);
    const deletedModule = await TrainingModule.findByIdAndDelete(id);
    if (!deletedModule) {
      console.warn("Training module not found for deletion with ID:", id);
      throw new Error("Training module not found for deletion");
    }
    console.log("Successfully deleted training module:", deletedModule);
    return deletedModule;
  } catch (error) {
    console.error("Error deleting module in controller:", error.message);
    throw new Error("Failed to delete training module");
  }
};

module.exports = {
  createModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule,
};
