const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/QuizController");
const { authenticateToken, isAdmin } = require("../middleware/AuthMiddleware");

// Admin only: Create a new quiz (requires authentication and admin role)
router.post("/", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    await QuizController.createQuiz(req, res);
  } catch (error) {
    next(error); // Use centralized error handling
  }
});

// Public route: Retrieve all quizzes
router.get("/", async (req, res, next) => {
  try {
    await QuizController.getQuizzes(req, res);
  } catch (error) {
    next(error); // Use centralized error handling
  }
});

// Public route: Retrieve a single quiz by its ID
router.get("/:id", async (req, res, next) => {
  try {
    await QuizController.getQuizById(req, res);
  } catch (error) {
    next(error); // Use centralized error handling
  }
});

// Protected route: Submit quiz answers and get a score (requires authentication)
router.post("/:id/submit", authenticateToken, async (req, res, next) => {
  try {
    await QuizController.submitQuiz(req, res);
  } catch (error) {
    next(error); // Use centralized error handling
  }
});

module.exports = router;
