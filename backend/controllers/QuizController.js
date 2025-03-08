const Quiz = require("../models/Quiz");
const Module = require("../models/TrainingModule");
const User = require("../models/User");

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { moduleId, questions } = req.body;

    // Validate input
    if (!moduleId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Missing required fields or questions" });
    }

    // Check if the module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Create and save the quiz
    const newQuiz = await Quiz.create({ module: moduleId, questions });

    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Retrieve all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("module", "title");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes", details: error.message });
  }
};

// Retrieve a single quiz by its ID
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate("module", "title");

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Submit quiz answers and get score
exports.submitQuiz = async (req, res) => {
  try {
    const { id } = req.params; // Quiz ID
    const { answers } = req.body; // User's submitted answers
    const userId = req.user?._id; // Get user ID from token

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch the quiz
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ error: "Incomplete or invalid answers provided." });
    }

    // Calculate score
    const score = quiz.questions.reduce((total, question, index) => {
      return total + (answers[index] === question.answer ? 1 : 0);
    }, 0);

    // Save result in user's profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.quizResults.push({
      quiz: id,
      score,
      totalQuestions: quiz.questions.length,
    });

    await user.save();

    // Return score
    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: quiz.questions.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
