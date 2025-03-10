const Quiz = require("../models/Quiz");
const Module = require("../models/TrainingModule");
const User = require("../models/User");

/**
 * Create a new quiz
 */
exports.createQuiz = async (req, res) => {
  try {
    const { moduleId, questions } = req.body;

    // Validate input
    if (!moduleId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Missing required fields or invalid questions format." });
    }

    // Check if the training module exists
    const trainingModule = await Module.findById(moduleId);
    if (!trainingModule) {
      return res.status(404).json({ error: "Training module not found." });
    }

    // Create and save the new quiz
    const newQuiz = await Quiz.create({ module: moduleId, questions });

    res.status(201).json({ message: "Quiz created successfully.", quiz: newQuiz });
  } catch (error) {
    console.error("Create Quiz Error:", error);
    res.status(500).json({ error: "Internal server error.", details: error.message });
  }
};

/**
 * Retrieve all quizzes
 */
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("module", "title");

    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Get Quizzes Error:", error);
    res.status(500).json({ error: "Failed to fetch quizzes.", details: error.message });
  }
};

/**
 * Retrieve a single quiz by ID
 */
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate("module", "title");

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Get Quiz By ID Error:", error);
    res.status(500).json({ error: "Internal server error.", details: error.message });
  }
};

/**
 * Submit quiz answers and get score
 */
exports.submitQuiz = async (req, res) => {
  try {
    const { id } = req.params; // Quiz ID
    const { answers } = req.body; // User's submitted answers
    const userId = req.user?.userId; // Get user ID from token

    // Check for valid user authentication
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. Please log in to submit the quiz." });
    }

    // Fetch the quiz and only return necessary fields (questions)
    const quiz = await Quiz.findById(id).select("questions");
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    // Validate answer submission format (check if answers match the question count)
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ error: "Invalid submission format. Ensure all questions are answered." });
    }

    // Calculate the user's score
    const score = quiz.questions.reduce((total, question, index) => {
      return total + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    // Save the result in the user's profile
    const user = await User.findById(userId).select("quizResults");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.quizResults.push({
      quiz: id,
      score,
      totalQuestions: quiz.questions.length,
      dateTaken: new Date(),
    });

    await user.save();

    // Return quiz results
    res.status(200).json({
      message: "Quiz submitted successfully.",
      score,
      totalQuestions: quiz.questions.length,
    });
  } catch (error) {
    console.error("Submit Quiz Error:", error);
    res.status(500).json({ error: "Internal server error.", details: error.message });
  }
};
