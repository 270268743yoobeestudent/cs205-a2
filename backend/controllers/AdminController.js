const mongoose = require("mongoose");
const User = require("../models/User");
const Report = require("../models/Report");

// Fetch all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "firstName lastName email role");
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found.",
      });
    }
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    next(err);
  }
};

// Add a new user
exports.addUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, role, password } = req.body;

    // Check if a user with this username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "A user with this username already exists.",
      });
    }

    // Check if a user with the same email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Create the new user
    const newUser = new User({ firstName, lastName, email, username, role, password });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User added successfully.",
      data: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Error adding user:", err.message);
    next(err);
  }
};

// Fetch all reports
exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate("employeeId", "firstName lastName email")
      .populate("completedModules", "title")
      .populate({ path: "quizScores.quizId", select: "title createdAt" });
    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reports found.",
      });
    }
    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    console.error("Error fetching all reports:", err);
    next(err);
  }
};

// Fetch a specific employee's report
exports.getEmployeeReport = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID format.",
      });
    }
    const report = await Report.findOne({ employeeId })
      .populate("employeeId", "firstName lastName email")
      .populate("completedModules", "title")
      .populate({ path: "quizScores.quizId", select: "title createdAt" });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No report found for this employee.",
      });
    }
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error(`Error fetching report for employee ${employeeId}:`, err);
    next(err);
  }
};

// Fetch reports with completed modules
exports.getFilteredReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ completedModules: { $exists: true, $ne: [] } })
      .populate("employeeId", "firstName lastName email")
      .populate("completedModules", "title");
    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reports found with completed modules.",
      });
    }
    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    console.error("Error fetching filtered reports:", err);
    next(err);
  }
};

// Update an employee's report
exports.updateEmployeeReport = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
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
    res.status(200).json({ success: true, data: updatedReport });
  } catch (err) {
    console.error(`Error updating report for employee ${employeeId}:`, err);
    next(err);
  }
};

// Delete an employee's report
exports.deleteEmployeeReport = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
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
    res.status(200).json({ success: true, message: "Report deleted successfully." });
  } catch (err) {
    console.error(`Error deleting report for employee ${employeeId}:`, err);
    next(err);
  }
};
