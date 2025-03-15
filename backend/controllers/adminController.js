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

// Training Module CRUD (updated for multiple sections)
exports.createModule = async (req, res) => {
  // Expect req.body to contain { title, sections }
  // where sections is an array of objects { header, content }
  const { title, sections } = req.body;
  try {
    const newModule = new TrainingModule({
      title,
      contentSections: sections,  // store the array of sections
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
  // Expect req.body to contain { title, sections }
  const { title, sections } = req.body;
  try {
    const updatedModule = await TrainingModule.findByIdAndUpdate(
      id,
      { title, contentSections: sections },
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
exports.getQuizzes = async (req, res) => {
  try {
    // Populate moduleId so that the related module data (including title) is available.
    const quizzes = await Quiz.find().populate('moduleId');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Quiz endpoint (includes title)
exports.createQuiz = async (req, res) => {
  const { title, moduleId, questions, passingScore } = req.body;
  try {
    const newQuiz = new Quiz({ title, moduleId, questions, passingScore });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz created', quiz: newQuiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Quiz endpoint (includes title)
exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, questions, passingScore } = req.body;
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { title, questions, passingScore },
      { new: true }
    ).populate('moduleId'); // Optionally populate after update
    res.json({ message: 'Quiz updated', quiz: updatedQuiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Quiz endpoint remains unchanged
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
    
    // Fetch all progress records for this employee and populate related fields
    const progressRecords = await UserProgress.find({ user: employeeId })
      .populate('completedModules')
      .populate({
        path: 'quizScores.quiz',
        populate: { path: 'moduleId' }
      });
    
    // Combine progress records into one combined object
    const combinedProgress = {
      completedModules: [],
      quizScores: []
    };
    progressRecords.forEach(record => {
      if (record.completedModules && record.completedModules.length > 0) {
        record.completedModules.forEach(mod => {
          if (!combinedProgress.completedModules.some(cm => String(cm._id) === String(mod._id))) {
            combinedProgress.completedModules.push(mod);
          }
        });
      }
      if (record.quizScores && record.quizScores.length > 0) {
        combinedProgress.quizScores = combinedProgress.quizScores.concat(record.quizScores);
      }
    });
    
    // Build CSV header
    let csv = 'Employee,Module,Completed,Quiz Score,Pass/Fail\n';
    
    modules.forEach(module => {
      // Determine completion status
      const completed = (combinedProgress.completedModules &&
        combinedProgress.completedModules.some(m => String(m._id) === String(module._id)))
        ? "Yes" : "No";
      
      // Filter quizScores for entries where the quiz's moduleId matches the current module
      let moduleQuizScores = [];
      if (combinedProgress.quizScores && combinedProgress.quizScores.length > 0) {
        moduleQuizScores = combinedProgress.quizScores.filter(qs => {
          if (qs.quiz && qs.quiz.moduleId) {
            // qs.quiz.moduleId may be populated or just an ID
            const modId = qs.quiz.moduleId._id ? qs.quiz.moduleId._id : qs.quiz.moduleId;
            return String(modId) === String(module._id);
          }
          return false;
        });
      }
      
      // If there are quiz attempts, choose the highest score; otherwise, show defaults.
      let quizScore = "Not attempted";
      let passFail = "N/A";
      if (moduleQuizScores.length > 0) {
        const highestEntry = moduleQuizScores.reduce((prev, curr) => 
          curr.score > prev.score ? curr : prev, moduleQuizScores[0]
        );
        quizScore = highestEntry.score;
        const passing = highestEntry.quiz && highestEntry.quiz.passingScore ? highestEntry.quiz.passingScore : 0;
        passFail = highestEntry.score >= passing ? "Passed" : "Failed";
      }
      
      csv += `"${employee.username}","${module.title}","${completed}","${quizScore}","${passFail}"\n`;
    });
    
    // Prepend UTF-8 BOM so Excel recognizes it as CSV
    const csvWithBOM = "\uFEFF" + csv;
    const filename = `${employee.username} Report.csv`;
    const csvBuffer = Buffer.from(csvWithBOM, 'utf-8');
    
    // Set headers to force download as CSV (using RFC 5987 encoding)
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
