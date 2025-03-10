const TrainingModule = require('../models/TrainingModule');

// Function to create a new training module
const createModule = async (moduleData) => {
  try {
    const newModule = new TrainingModule(moduleData); // Create a new instance from model
    await newModule.save();  // Save the new module to the database
    return newModule;        // Return the newly created module
  } catch (error) {
    console.error('Error creating module in controller:', error);
    throw new Error('Error creating module'); // Rethrow error to be handled in the route
  }
};

// Function to retrieve all training modules
const getModules = async () => {
  try {
    return await TrainingModule.find();  // Retrieve all modules
  } catch (error) {
    console.error('Error retrieving modules in controller:', error);
    throw new Error('Error fetching modules'); // Rethrow error to be handled in the route
  }
};

// Function to retrieve a module by ID
const getModuleById = async (id) => {
  try {
    return await TrainingModule.findById(id);  // Retrieve module by ID
  } catch (error) {
    console.error('Error retrieving module by ID in controller:', error);
    throw new Error('Error fetching module by ID'); // Rethrow error to be handled in the route
  }
};

module.exports = { createModule, getModules, getModuleById };
