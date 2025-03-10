const Report = require("../models/Report");
const Module = require("../models/TrainingModule");
const User = require("../models/User"); // Assuming the User model exists for employee details

/**
 * Get all reports (Admin Only)
 */
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("employeeId", "name email"); // Populate employeeId to get relevant user info

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to retrieve reports", details: error.message });
  }
};

/**
 * Get an individual employee's report (Admin Only)
 */
exports.getEmployeeReport = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Ensure that the employee report exists
    const report = await Report.findOne({ employeeId })
      .populate("employeeId", "name email"); // Populate to get user info

    if (!report) {
      return res.status(404).json({ error: "No report found for this employee" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching employee report:", error);
    res.status(500).json({ error: "Failed to retrieve employee report", details: error.message });
  }
};

/**
 * Get an employee's training progress (Admin Only)
 */
exports.getEmployeeProgress = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find the employee's report by ID
    const report = await Report.findOne({ employeeId })
      .populate("employeeId", "name email");

    if (!report) {
      return res.status(404).json({ error: "No report found for this employee" });
    }

    // Get total modules and completed modules count
    const totalModules = await Module.countDocuments(); // Get the total count of modules in the system
    const completedModules = report.completedModules?.length || 0;
    const remainingModules = totalModules - completedModules;

    // Calculate the average quiz score
    let totalScore = 0;
    let totalQuestions = 0;

    report.quizScores?.forEach(({ score, totalQuestions: quizTotal }) => {
      totalScore += score;
      totalQuestions += quizTotal;
    });

    const averageQuizScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

    // Respond with structured progress data
    res.status(200).json({
      employeeId: report.employeeId._id,
      name: report.employeeId.name,
      email: report.employeeId.email,
      completedModules,
      remainingModules,
      averageQuizScore: averageQuizScore.toFixed(2), // Format the score to 2 decimal places
    });
  } catch (error) {
    console.error("Error fetching employee progress:", error);
    res.status(500).json({ error: "Failed to retrieve employee progress", details: error.message });
  }
};
