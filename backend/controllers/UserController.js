const User = require("../models/User");
const TrainingModule = require("../models/TrainingModule");

exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user?._id;

    // Validate user ID exists
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not provided. Please ensure you're logged in.",
      });
    }

    console.log("Fetching progress for user:", userId); // Debugging

    // Fetch user with completed modules and quiz results
    const user = await User.findById(userId)
      .populate("completedModules", "title")
      .populate("quizResults.quiz", "title");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    console.log("User data retrieved:", {
      completedModules: user.completedModules,
      quizResults: user.quizResults,
    }); // Debugging

    // Fetch all training modules
    const allModules = await TrainingModule.find({}, "title");

    if (!allModules.length) {
      return res.status(404).json({
        success: false,
        message: "No training modules found. Please contact the admin.",
      });
    }

    // Calculate remaining modules
    const completedModuleIds = user.completedModules.map((mod) => mod._id.toString());
    const remainingModules = allModules.filter(
      (module) => !completedModuleIds.includes(module._id.toString())
    );

    // Calculate average quiz score
    const quizScores = user.quizResults.map((result) => result.score);
    const averageQuizScore =
      quizScores.length > 0
        ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
        : null;

    console.log("Remaining modules calculated:", remainingModules); // Debugging

    // Create progress data response
    const progressData = {
      completedModules: user.completedModules,
      remainingModules,
      quizScores: user.quizResults.map((result) => ({
        title: result.quiz?.title || "Untitled Quiz",
        score: result.score,
      })),
      totalModules: allModules.length,
      averageQuizScore,
    };

    res.status(200).json({ success: true, data: progressData });
  } catch (error) {
    console.error("Error fetching user progress:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching progress. Please try again later.",
    });
  }
};
