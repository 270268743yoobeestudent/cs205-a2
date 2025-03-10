const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/QuizController");
const { authenticateToken, isAdmin } = require("../middleware/AuthMiddleware");

// Admin only: Create a new quiz
router.post("/", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    await QuizController.createQuiz(req, res);
  } catch (error) {
    next(error); // Forward errors to centralized handler
  }
});

// Public route: Retrieve all quizzes
router.get("/", async (req, res, next) => {
  try {
    await QuizController.getQuizzes(req, res);
  } catch (error) {
    next(error); // Forward errors to centralized handler
  }
});

// Public route: Retrieve a quiz by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Quiz ID is required" });
    }

    await QuizController.getQuizById(req, res);
  } catch (error) {
    next(error); // Forward errors to centralized handler
  }
});

// Protected route: Submit quiz answers
router.post("/:id/submit", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Quiz ID is required" });
    }

    await QuizController.submitQuiz(req, res);
  } catch (error) {
    next(error); // Forward errors to centralized handler
  }
});

module.exports = router;
