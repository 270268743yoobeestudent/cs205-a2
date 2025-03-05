const Report = require("../models/Report");
const Module = require("../models/TrainingModule");
const User = require("../models/User");  // Assuming you have a User model to get employee details

// Existing function to get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("employeeId", "name email");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports", details: error.message });
  }
};

// Existing function to get an employee's report
exports.getEmployeeReport = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const report = await Report.findOne({ employeeId }).populate("employeeId", "name email");

    if (!report) {
      return res.status(404).json({ error: "Report not found for this employee" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// New function to get an employee's progress
exports.getEmployeeProgress = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find the employee's report
    const report = await Report.findOne({ employeeId }).populate("employeeId", "name email");

    if (!report) {
      return res.status(404).json({ error: "No report found for this employee" });
    }

    // Get completed modules
    const completedModules = report.completedModules.length;

    // Get all modules (to calculate remaining modules)
    const allModules = await Module.find();

    // Calculate remaining modules
    const remainingModules = allModules.length - completedModules;

    // Calculate average quiz score
    let totalQuizScore = 0;
    let totalQuestions = 0;

    report.quizScores.forEach((quizScore) => {
      totalQuizScore += quizScore.score;
      totalQuestions += quizScore.totalQuestions;
    });

    const averageQuizScore = totalQuestions > 0 ? (totalQuizScore / totalQuestions) * 100 : 0;

    // Respond with progress data
    res.status(200).json({
      employeeId: report.employeeId,
      name: report.employeeId.name,
      completedModules,
      remainingModules,
      averageQuizScore,
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving employee progress", details: error.message });
  }
};
