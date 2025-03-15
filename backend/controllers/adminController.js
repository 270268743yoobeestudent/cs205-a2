// backend/controllers/adminController.js
const User = require('../models/User');
const TrainingModule = require('../models/TrainingModule');
const Quiz = require('../models/Quiz');
const UserProgress = require('../models/UserProgress');

// Middleware to allow only admins
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorised: Admins only' });
  }
};

// Employee CRUD – Admin-only registration
exports.createEmployee = async (req, res) => {
  const { username, password } = req.body; // using username for registration
  try {
    const newEmployee = new User({ username, password, role: 'employee' });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee created', employee: newEmployee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    // Retrieve all users (both admin and employee)
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { username, role, password } = req.body;
  try {
    let updateData = { username, role };
    if (password && password.trim() !== '') {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    const employee = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: 'Employee updated', employee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  // Prevent admin from deleting their own account
  if (req.session.userId === id) {
    return res.status(400).json({ message: "You cannot delete your own account." });
  }
  
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Training Module CRUD (updated)
exports.createModule = async (req, res) => {
  const { title, header, content } = req.body;
  try {
    // Combine header and content into one field
    const fullContent = header + "\n\n" + content;
    const newModule = new TrainingModule({
      title,
      content: fullContent,
      createdBy: req.session.userId
    });
    await newModule.save();
    res.status(201).json({ message: 'Training module created', module: newModule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getModules = async (req, res) => {
  try {
    const modules = await TrainingModule.find();
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateModule = async (req, res) => {
  const { id } = req.params;
  const { title, header, content } = req.body;
  try {
    // Combine header and content before updating
    const fullContent = header + "\n\n" + content;
    const updatedModule = await TrainingModule.findByIdAndUpdate(
      id,
      { title, content: fullContent },
      { new: true }
    );
    res.json({ message: 'Module updated', module: updatedModule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteModule = async (req, res) => {
  const { id } = req.params;
  try {
    await TrainingModule.findByIdAndDelete(id);
    res.json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Quiz CRUD
exports.createQuiz = async (req, res) => {
  const { moduleId, questions, passingScore } = req.body;
  try {
    const newQuiz = new Quiz({ moduleId, questions, passingScore });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created', quiz: newQuiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { questions, passingScore } = req.body;
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, { questions, passingScore }, { new: true });
    res.json({ message: 'Quiz updated', quiz: updatedQuiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    await Quiz.findByIdAndDelete(id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Report Generation
exports.generateReport = async (req, res) => {
  try {
    const { employeeId } = req.query;
    if (!employeeId) {
      console.error("No employeeId provided in query");
      return res.status(400).json({ message: 'Employee ID is required' });
    }
    
    // Find the employee
    const employee = await User.findById(employeeId);
    if (!employee) {
      console.error(`Employee not found for id: ${employeeId}`);
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Fetch all modules
    const modules = await TrainingModule.find();
    
    // Fetch progress for this employee (if any) and populate moduleId
    const progressRecords = await UserProgress.find({ userId: employeeId }).populate('moduleId');
    
    // Build CSV header
    let csv = 'Employee,Module,Completed,Quiz Results\n';
    
    // For every module in the system, check if the employee has progress data
    modules.forEach(module => {
      // Check if progress exists and that moduleId is not null
      const progress = progressRecords.find(
        p => p.moduleId && String(p.moduleId._id) === String(module._id)
      );
      const completed = progress ? (progress.completionStatus ? 'Yes' : 'No') : 'No';
      const quizResults =
        progress && progress.quizResults && progress.quizResults.length > 0
          ? progress.quizResults
              .map(q => `Score: ${q.score} (${q.passed ? 'Passed' : 'Failed'})`)
              .join('; ')
          : 'Not attempted';
      
      csv += `"${employee.username}","${module.title}","${completed}","${quizResults}"\n`;
    });
    
    // Prepend UTF-8 BOM for compatibility with Excel
    const csvWithBOM = "\uFEFF" + csv;
    const filename = `${employee.username} Report.csv`;
    const csvBuffer = Buffer.from(csvWithBOM, 'utf-8');
    
    // Set headers to force download as CSV
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
    res.setHeader('Content-Length', csvBuffer.length);
    
    return res.end(csvBuffer);
  } catch (err) {
    console.error('Error in generateReport:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all user progress
exports.getAllProgress = async (req, res) => {
  try {
    const progress = await UserProgress.find().populate('userId').populate('moduleId');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
