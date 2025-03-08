const Report = require("../models/Report");

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("employeeId", "name email")
      .populate("completedModules", "title")
      .populate({
        path: "quizScores.quizId",
        select: "title createdAt"
      });
    res.json(reports);
  } catch (err) {
    console.error("Error fetching all reports:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getEmployeeReport = async (req, res) => {
  try {
    const report = await Report.findOne({ employeeId: req.params.employeeId })
      .populate("employeeId", "name email")
      .populate("completedModules", "title")
      .populate({
        path: "quizScores.quizId",
        select: "title createdAt"
      });

    if (!report) {
      return res.status(404).json({ message: "Report not found for this employee." });
    }

    res.json(report);
  } catch (err) {
    console.error(`Error fetching report for employee ${req.params.employeeId}:`, err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFilteredReports = async (req, res) => {
  try {
    const reports = await Report.find({ completedModules: { $ne: [] } })
      .populate("employeeId", "name email")
      .populate("completedModules", "title");

    if (reports.length === 0) {
      return res.status(404).json({ message: "No reports with completed modules found." });
    }

    res.json(reports);
  } catch (err) {
    console.error("Error fetching filtered reports:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateEmployeeReport = async (req, res) => {
  try {
    const updatedReport = await Report.findOneAndUpdate(
      { employeeId: req.params.employeeId },
      req.body,
      { new: true }
    );
    
    if (!updatedReport) {
      return res.status(404).json({ message: "Employee report not found." });
    }

    res.json(updatedReport);
  } catch (err) {
    console.error(`Error updating report for employee ${req.params.employeeId}:`, err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteEmployeeReport = async (req, res) => {
  try {
    const deletedReport = await Report.findOneAndDelete({ employeeId: req.params.employeeId });

    if (!deletedReport) {
      return res.status(404).json({ message: "Employee report not found." });
    }

    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error(`Error deleting report for employee ${req.params.employeeId}:`, err);
    res.status(500).json({ error: "Server error" });
  }
};
