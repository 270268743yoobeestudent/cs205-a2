const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/QuizController");
const { isAuthenticated, isAdmin } = require("../middleware/AuthMiddleware");

/**
 * Admin only: Create a new quiz
 */
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const newQuiz = await QuizController.createQuiz(req.body); // Pass only body to controller
    res.status(201).json({
      success: true,
      message: "Quiz created successfully.",
      data: newQuiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create quiz.",
      error: error.message,
    });
  }
});

/**
 * Public route: Retrieve all quizzes
 */
router.get("/", async (req, res) => {
  try {
    const quizzes = await QuizController.getQuizzes();
    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve quizzes.",
      error: error.message,
    });
  }
});

/**
 * Public route: Retrieve a quiz by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID is required.",
      });
    }

    const quiz = await QuizController.getQuizById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve quiz by ID.",
      error: error.message,
    });
  }
});

/**
 * Protected route: Submit quiz answers
 */
router.post("/:id/submit", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID is required.",
      });
    }

    const result = await QuizController.submitQuiz(id, req.body.answers); // Pass ID and answers to controller
    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit quiz.",
      error: error.message,
    });
  }
});

module.exports = router;
