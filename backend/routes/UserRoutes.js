const express = require("express");
const router = express.Router();
const User = require("../models/User");
const userController = require("../controllers/UserController");
const { isAuthenticated } = require("../middleware/AuthMiddleware");

// Get user progress
router.get("/me/progress", isAuthenticated, userController.getUserProgress);

// Get the current user's profile
router.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id; // Retrieve user ID from authentication middleware
    const user = await userController.getUserProfile(userId);  // Ensure this function exists in UserController

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    next(error);  // Pass the error to the error handler middleware
  }
});

// Update the current user's profile
router.put("/me", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedUser = await userController.updateUserProfile(userId, req.body);  // Ensure this function exists

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    next(error);  // Pass the error to the error handler middleware
  }
});

// Mark a training module as completed
router.patch("/me/complete-module/:moduleId", isAuthenticated, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id;

    // Find user and update completedModules array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { completedModules: moduleId } }, // Prevent duplicates
      { new: true }
    ).populate("completedModules");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Module marked as completed",
      completedModules: updatedUser.completedModules,
    });
  } catch (error) {
    console.error("Error marking module as completed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
