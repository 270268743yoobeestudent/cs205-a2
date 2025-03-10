const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authenticateToken } = require("../middleware/AuthMiddleware");

// Get the current user's profile
router.get("/me", authenticateToken, async (req, res, next) => {
  try {
    const user = await userController.getUserProfile(req.user.userId);
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
router.put("/me", authenticateToken, async (req, res, next) => {
  try {
    const updatedUser = await userController.updateUserProfile(req.user.userId, req.body);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    next(error);
  }
});

module.exports = router;
