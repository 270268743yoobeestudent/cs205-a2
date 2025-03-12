const express = require("express");
const router = express.Router();
const { getUserProgress } = require("../controllers/UserController");
const { isAuthenticated } = require("../middleware/AuthMiddleware");

// Get user progress
router.get("/me/progress", isAuthenticated, getUserProgress);

// Get the current user's profile
router.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    // Use session-based authentication
    const userId = req.session.user.id; // Retrieve user ID from the session
    const user = await userController.getUserProfile(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    next(error);
  }
});

// Update the current user's profile
router.put("/me", isAuthenticated, async (req, res, next) => {
  try {
    // Use session-based authentication
    const userId = req.session.user.id; // Retrieve user ID from the session
    const updatedUser = await userController.updateUserProfile(userId, req.body);

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    next(error);
  }
});

module.exports = router;
