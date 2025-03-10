const Quiz = require("../models/Quiz");
const Module = require("../models/TrainingModule");
const User = require("../models/User");

/**
 * Create a new quiz
 */
exports.createQuiz = async (req, res, next) => {
  try {
    const { moduleId, questions } = req.body;

    // Validate input
    if (!moduleId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or invalid questions format.",
      });
    }

    // Check if the training module exists
    const trainingModule = await Module.findById(moduleId);
    if (!trainingModule) {
      return res.status(404).json({
        success: false,
        message: "Training module not found.",
      });
    }

    // Create and save the new quiz
    const newQuiz = await Quiz.create({ module: moduleId, questions });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully.",
      data: newQuiz,
    });
  } catch (error) {
    console.error("Create Quiz Error:", error);
    next(error);
  }
};

/**
 * Retrieve all quizzes
 */
exports.getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find().populate("module", "title");

    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    console.error("Get Quizzes Error:", error);
    next(error);
  }
};

/**
 * Retrieve a single quiz by ID
 */
exports.getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate("module", "title");

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
    console.error("Get Quiz By ID Error:", error);
    next(error);
  }
};

/**
 * Submit quiz answers and get score
 */
exports.submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params; // Quiz ID
    const { answers } = req.body; // User's submitted answers
    const userId = req.user?.userId; // Get user ID from token

    // Check for valid user authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in to submit the quiz.",
      });
    }

    // Fetch the quiz and only return necessary fields (questions)
    const quiz = await Quiz.findById(id).select("questions");
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    // Validate answer submission format
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission format. Ensure all questions are answered.",
      });
    }

    // Calculate the user's score
    const score = quiz.questions.reduce((total, question, index) => {
      return total + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    // Save the result in the user's profile
    const user = await User.findById(userId).select("quizResults");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
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
      success: true,
      message: "Quiz submitted successfully.",
      data: {
        score,
        totalQuestions: quiz.questions.length,
      },
    });
  } catch (error) {
    console.error("Submit Quiz Error:", error);
    next(error);
  }
};
