const mongoose = require("mongoose");
const Report = require("../models/Report");

/**
 * Fetch all reports
 */
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("employeeId", "name email")
      .populate("completedModules", "title")
      .populate({
        path: "quizScores.quizId",
        select: "title createdAt",
      });

    res.status(200).json(reports);
  } catch (err) {
    console.error("Error fetching all reports:", err);
    res.status(500).json({ error: "Failed to retrieve reports", details: err.message });
  }
};

/**
 * Fetch a specific employee's report
 */
exports.getEmployeeReport = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Validate employeeId format
    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID format" });
    }

    const report = await Report.findOne({ employeeId })
      .populate("employeeId", "name email")
      .populate("completedModules", "title")
      .populate({
        path: "quizScores.quizId",
        select: "title createdAt",
      });

    if (!report) {
      return res.status(404).json({ error: "No report found for this employee" });
    }

    res.status(200).json(report);
  } catch (err) {
    console.error(`Error fetching report for employee ${req.params.employeeId}:`, err);
    res.status(500).json({ error: "Failed to retrieve employee report", details: err.message });
  }
};

/**
 * Fetch reports where employees have completed at least one module
 */
exports.getFilteredReports = async (req, res) => {
  try {
    const reports = await Report.find({ completedModules: { $exists: true, $ne: [] } })
      .populate("employeeId", "name email")
      .populate("completedModules", "title");

    if (reports.length === 0) {
      return res.status(404).json({ message: "No reports found with completed modules" });
    }

    res.status(200).json(reports);
  } catch (err) {
    console.error("Error fetching filtered reports:", err);
    res.status(500).json({ error: "Failed to retrieve filtered reports", details: err.message });
  }
};

/**
 * Update an employee's report
 */
exports.updateEmployeeReport = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Validate employeeId format
    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID format" });
    }

    const updatedReport = await Report.findOneAndUpdate(
      { employeeId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ error: "Employee report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (err) {
    console.error(`Error updating report for employee ${req.params.employeeId}:`, err);
    res.status(500).json({ error: "Failed to update report", details: err.message });
  }
};

/**
 * Delete an employee's report
 */
exports.deleteEmployeeReport = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Validate employeeId format
    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ error: "Invalid employee ID format" });
    }

    const deletedReport = await Report.findOneAndDelete({ employeeId });

    if (!deletedReport) {
      return res.status(404).json({ error: "Employee report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error(`Error deleting report for employee ${req.params.employeeId}:`, err);
    res.status(500).json({ error: "Failed to delete report", details: err.message });
  }
};
