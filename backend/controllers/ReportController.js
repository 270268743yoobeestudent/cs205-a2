const User = require('../models/User'); // Import the User model

// Get progress for all users with pagination
exports.getAllProgress = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch users with pagination
        const users = await User.find().select('name completedModules')
            .skip(skip)
            .limit(limit);
        
        // Optionally, you could also get the total count of users for pagination purposes
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
};

// Get progress for a specific user
exports.getUserProgress = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('name completedModules');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user); 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user progress', error: error.message });
    }
};

// Export a report (placeholder)
exports.exportReport = async (req, res) => {
    try {
        // Placeholder function to simulate exporting a report (could integrate CSV/PDF library)
        // For now, let's simulate the export with a JSON response.
        
        const users = await User.find().select('name completedModules');
        
        // Simulate generating a report (e.g., CSV or PDF) and return success message
        res.status(200).json({ message: 'Report exported successfully', reportData: users }); 
    } catch (error) {
        res.status(500).json({ message: 'Error exporting report', error: error.message });
    }
};
