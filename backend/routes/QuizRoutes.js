const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/QuizController");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// Admin only: Create a new quiz (requires authentication and admin role)
router.post("/", authenticateToken, isAdmin, QuizController.createQuiz);

// Public route: Retrieve all quizzes
router.get("/", QuizController.getQuizzes);

// Public route: Retrieve a single quiz by its ID
router.get("/:id", QuizController.getQuizById);

// Protected route: Submit quiz answers and get a score (requires authentication)
router.post("/:id/submit", authenticateToken, QuizController.submitQuiz);

module.exports = router;
