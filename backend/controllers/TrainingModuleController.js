const Module = require("../models/TrainingModule");
const Report = require("../models/Report");

// Controller for completing a training module for an employee
exports.completeModule = async (req, res) => {
  try {
    const { moduleId, employeeId } = req.body;

    // Validate the required fields
    if (!moduleId || !employeeId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find or create a report for the employee
    let report = await Report.findOne({ employeeId });

    if (!report) {
      // If no report exists for the employee, create one
      report = new Report({
        employeeId,
        completedModules: [],
        quizScores: [],
        improvementAreas: [],
      });
    }

    // Prevent adding duplicate module completions
    if (!report.completedModules.includes(moduleId)) {
      report.completedModules.push(moduleId);
    }

    // Update the last updated timestamp
    report.lastUpdated = Date.now();

    // Save the updated report
    await report.save();

    // Send a success response with the updated report
    res.status(200).json({
      message: "Module completed successfully",
      report,
    });
  } catch (error) {
    // Log the error and send an appropriate response
    console.error("Error completing module:", error);

    res.status(500).json({
      error: "Server error",
      details: error.message,  // Provide error details for easier debugging
    });
  }
};
