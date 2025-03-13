// routes/progressRoutes.js
const express = require("express");
const router = express.Router();
const { getUserProgress, getAllUsersProgress } = require("../controllers/ProgressController");
const authMiddleware = require("../middlewares/authMiddleware"); // Assuming this middleware is for checking authenticated users

// Employee route to get their own progress
router.get("/my-progress", authMiddleware, getUserProgress);

// Admin route to get all users' progress
router.get("/all-progress", authMiddleware, getAllUsersProgress);

module.exports = router;
