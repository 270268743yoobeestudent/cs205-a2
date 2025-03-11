const Quiz = require("../models/Quiz");
const Module = require("../models/TrainingModule");
const User = require("../models/User");

/**
 * Create a new quiz
 */
exports.createQuiz = async (data) => {
  const { module, title, questions } = data;

  // Validate input
  if (!module || !title || !Array.isArray(questions) || questions.length === 0) {
    throw new Error("Missing required fields or invalid questions format.");
  }

  // Check if the training module exists
  const trainingModule = await Module.findById(module);
  if (!trainingModule) {
    throw new Error("Training module not found.");
  }

  // Create and save the new quiz
  const newQuiz = await Quiz.create({ module, title, questions });
  return newQuiz;
};

/**
 * Retrieve all quizzes
 */
exports.getQuizzes = async () => {
  const quizzes = await Quiz.find().populate("module", "title description");
  return quizzes;
};

/**
 * Retrieve a single quiz by ID
 */
exports.getQuizById = async (id) => {
  const quiz = await Quiz.findById(id).populate("module", "title description");
  if (!quiz) {
    throw new Error("Quiz not found.");
  }
  return quiz;
};

/**
 * Submit quiz answers and calculate score
 */
exports.submitQuiz = async (id, userId, answers) => {
  if (!userId) {
    throw new Error("Unauthorized. Please log in to submit the quiz.");
  }

  // Fetch the quiz and its questions
  const quiz = await Quiz.findById(id).select("questions");
  if (!quiz) {
    throw new Error("Quiz not found.");
  }

  // Validate answer submission format
  if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
    throw new Error("Invalid submission format. Ensure all questions are answered.");
  }

  // Calculate the user's score
  const score = quiz.questions.reduce((total, question, index) => {
    return total + (answers[index] === question.correctAnswer ? 1 : 0);
  }, 0);

  // Save the result in the user's profile
  const user = await User.findById(userId).select("quizResults");
  if (!user) {
    throw new Error("User not found.");
  }

  user.quizResults.push({
    quiz: id,
    score,
    totalQuestions: quiz.questions.length,
    dateTaken: new Date(),
  });

  await user.save();

  // Return quiz results
  return { score, totalQuestions: quiz.questions.length };
};
