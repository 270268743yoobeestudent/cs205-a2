const mongoose = require("mongoose");
const Report = require("../models/Report");

/**
 * Fetch all reports
 */
exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate("employeeId", "firstName lastName email") // Updated to reflect detailed user fields
      .populate("completedModules", "title") // Populate completed modules
      .populate({
        path: "quizScores.quizId",
        select: "title createdAt",
      }); // Populate quiz details

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (err) {
    console.error("Error fetching all reports:", err);
    next(err); // Forward error to centralized error handler
  }
};

/**
 * Fetch a specific employee's report
 */
exports.getEmployeeReport = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    // Validate employeeId format
    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format.",
      });
    }

    const report = await Report.findOne({ employeeId })
      .populate("employeeId", "firstName lastName email") // Populate user details
      .populate("completedModules", "title")
      .populate({
        path: "quizScores.quizId",
        select: "title createdAt",
      });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No report found for this employee.",
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error(`Error fetching report for employee ${req.params.employeeId}:`, err);
    next(err);
  }
};

/**
 * Fetch reports where employees have completed at least one module
 */
exports.getFilteredReports = async (req, res, next) => {
  try {
    const reports = await Report.find({
      completedModules: { $exists: true, $ne: [] }, // Employees with completed modules
    })
      .populate("employeeId", "firstName lastName email")
      .populate("completedModules", "title");

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reports found with completed modules.",
      });
    }

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (err) {
    console.error("Error fetching filtered reports:", err);
    next(err);
  }
};

/**
 * Update an employee's report
 */
exports.updateEmployeeReport = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    // Validate employeeId format
    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format.",
      });
    }

    const updatedReport = await Report.findOneAndUpdate(
      { employeeId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        message: "Employee report not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedReport,
    });
  } catch (err) {
    console.error(`Error updating report for employee ${req.params.employeeId}:`, err);
    next(err);
  }
};

/**
 * Delete an employee's report
 */
exports.deleteEmployeeReport = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    // Validate employeeId format
    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format.",
      });
    }

    const deletedReport = await Report.findOneAndDelete({ employeeId });

    if (!deletedReport) {
      return res.status(404).json({
        success: false,
        message: "Employee report not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully.",
    });
  } catch (err) {
    console.error(`Error deleting report for employee ${req.params.employeeId}:`, err);
    next(err);
  }
};
