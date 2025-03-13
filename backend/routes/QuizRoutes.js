const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/QuizController");
const { isAuthenticated, isAdmin } = require("../middleware/AuthMiddleware");

/**
 * Admin only: Create a new quiz
 * POST /api/quizzes/create
 */
router.post('/create', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, questions } = req.body;

    // Validate request body
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz title and questions are required.",
      });
    }

    const newQuiz = await QuizController.createQuiz({ title, questions });
    
    if (!newQuiz) {
      return res.status(500).json({
        success: false,
        message: "Failed to create quiz.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Quiz created successfully.",
      data: newQuiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create quiz.",
      error: error.message || "Unknown error occurred",
    });
  }
});

/**
 * Public route: Retrieve all quizzes
 * GET /api/quizzes
 */
router.get("/", async (req, res) => {
  try {
    const quizzes = await QuizController.getAllQuizzes();
    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve quizzes.",
      error: error.message || "Unknown error occurred",
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
    console.error("Error fetching quiz by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve quiz by ID.",
      error: error.message || "Unknown error occurred",
    });
  }
});

/**
 * Protected route: Submit quiz answers
 * POST /api/quizzes/:id/submit
 */
router.post("/:id/submit", isAuthenticated, async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const { id } = req.params;

    // Validate quiz ID and answers
    if (!id || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID and answers are required.",
      });
    }

    const result = await QuizController.submitQuiz(userId, id, answers);
    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit quiz.",
      error: error.message || "Unknown error occurred",
    });
  }
});

module.exports = router;
