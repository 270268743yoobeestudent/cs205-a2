// controllers/progressController.js
const User = require("../models/User");
const Module = require("../models/Module"); // Assuming the module model exists
const Quiz = require("../models/Quiz"); // Assuming the quiz model exists

// Get user progress (completed modules, quiz scores)
const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using session-based authentication to get the user ID

    // Find the user
    const user = await User.findById(userId).populate("completedModules").populate("quizScores.quizId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Prepare the progress data
    const progress = {
      completedModules: user.completedModules,
      quizScores: user.quizScores,
    };

    return res.status(200).json({
      success: true,
      message: "User progress retrieved successfully.",
      data: progress,
    });
  } catch (error) {
    console.error("Error retrieving user progress:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving user progress.",
    });
  }
};

// Get all users' progress (for admins)
const getAllUsersProgress = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    // Get all users and populate relevant fields
    const users = await User.find().populate("completedModules").populate("quizScores.quizId");

    return res.status(200).json({
      success: true,
      message: "All users' progress retrieved successfully.",
      data: users,
    });
  } catch (error) {
    console.error("Error retrieving all users' progress:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while retrieving all users' progress.",
    });
  }
};

module.exports = { getUserProgress, getAllUsersProgress };
