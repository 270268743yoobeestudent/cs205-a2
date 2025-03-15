const TrainingModule = require('../models/TrainingModule'); // Import the TrainingModule model

// Create a new training module (Admin Only)
const createTrainingModule = async (req, res) => {
    try {
        const { title, description, content, quiz } = req.body;

        if (!title || !description || !content) {
            return res.status(400).json({ message: 'Title, description, and content are required' });
        }

        const newModule = new TrainingModule({
            title,
            description,
            content,
            quiz: quiz || [], // Ensure quiz is an empty array if not provided
        });

        await newModule.save();
        res.status(201).json({ message: 'Training module created successfully', module: newModule });
    } catch (error) {
        console.error('Error creating module:', error);
        res.status(500).json({ message: 'Failed to create module', error: error.message });
    }
};

// Get all training modules (Admin Only)
const getAllModules = async (req, res) => {
    try {
        const modules = await TrainingModule.find();
        res.status(200).json(modules);
    } catch (error) {
        console.error('Error retrieving modules:', error);
        res.status(500).json({ message: 'Failed to retrieve modules', error: error.message });
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
        console.error('Error retrieving module:', error);
        res.status(500).json({ message: 'Failed to retrieve module', error: error.message });
    }
};

// Update a training module by ID (Admin Only)
const updateTrainingModule = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, content, quiz } = req.body;

        const updatedModule = await TrainingModule.findByIdAndUpdate(
            id,
            { title, description, content, quiz },
            { new: true, runValidators: true }
        );

        if (!updatedModule) {
            return res.status(404).json({ message: 'Module not found' });
        }

        res.status(200).json({ message: 'Module updated successfully', module: updatedModule });
    } catch (error) {
        console.error('Error updating module:', error);
        res.status(500).json({ message: 'Failed to update module', error: error.message });
    }
};

// Delete a training module by ID (Admin Only)
const deleteModule = async (req, res) => {
    try {
        const { id } = req.params;
        const module = await TrainingModule.findByIdAndDelete(id);

        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        res.status(200).json({ message: 'Module deleted successfully' });
    } catch (error) {
        console.error('Error deleting module:', error);
        res.status(500).json({ message: 'Failed to delete module', error: error.message });
    }
};

// Get training modules available for employees
const getModulesForEmployee = async (req, res) => {
    try {
        const modules = await TrainingModule.find({}, 'title description');

        if (!modules || modules.length === 0) {
            return res.status(200).json([]); // Return empty array instead of undefined
        }

        res.status(200).json(modules);
    } catch (error) {
        console.error('Error retrieving employee modules:', error);
        res.status(500).json({ message: 'Failed to retrieve employee modules', error: error.message });
    }
};

// Export all controller functions
module.exports = {
    createTrainingModule,
    getAllModules,
    getTrainingModule,
    updateTrainingModule,
    deleteModule,
    getModulesForEmployee, // ✅ Ensure this function is exported
};
