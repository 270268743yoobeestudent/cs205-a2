const express = require("express");
const Report = require("../models/Report");
const router = express.Router();

// Get all reports (Admin Only)
router.get("/", async (req, res) => {
  try {
    // Populate employee details, completed modules, and specific quiz information (only quiz title for efficiency)
    const reports = await Report.find().populate("employeeId", "name email")
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
});

// Get a specific employee's report (Admin Only)
router.get("/:employeeId", async (req, res) => {
  try {
    const report = await Report.findOne({ employeeId: req.params.employeeId })
      .populate("employeeId", "name email")
      .populate("completedModules", "title")
      .populate({
        path: "quizScores.quizId",
        select: "title createdAt"
      });

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json(report);
  } catch (err) {
    console.error(`Error fetching report for employee ${req.params.employeeId}:`, err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get reports filtered by completion status (Admin Only)
router.get("/filter/completed", async (req, res) => {
  try {
    const reports = await Report.find({ completedModules: { $ne: [] } })
                                .populate("employeeId", "name email")
                                .populate("completedModules", "title");

    res.json(reports);
  } catch (err) {
    console.error("Error fetching filtered reports:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
