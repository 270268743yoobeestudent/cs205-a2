const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/QuizController");
const { isAuthenticated, isAdmin } = require("../middleware/AuthMiddleware");

/**
 * Admin only: Create a new quiz
 * POST /api/quizzes
 */
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Ensure the request body contains the necessary data
    const { title, questions } = req.body;
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz title and questions are required.",
      });
    }

    // Create the new quiz
    const newQuiz = await QuizController.createQuiz(req.body);
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
 * GET /api/quizzes
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
 * GET /api/quizzes/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate quiz ID
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
 * POST /api/quizzes/:id/submit
 */
router.post("/:id/submit", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    // Validate quiz ID and answers
    if (!id || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID and answers are required.",
      });
    }

    // Submit the quiz answers
    const result = await QuizController.submitQuiz(id, answers);
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
