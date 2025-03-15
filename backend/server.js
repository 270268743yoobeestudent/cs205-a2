require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import models and controllers
const UserController = require('./controllers/UserController');
const TrainingModuleController = require('./controllers/TrainingModuleController');
const QuizController = require('./controllers/QuizController');
const ReportController = require('./controllers/ReportController');
const AuthMiddleware = require('./middleware/AuthMiddleware');
const ValidateMiddleware = require('./middleware/ValidateMiddleware');

// Routes for user authentication and profile management
app.post('/register', UserController.registerUser);
app.post('/login', UserController.loginUser);
app.post('/logout', AuthMiddleware.isAuthenticated, UserController.logoutUser);

// Routes for training modules
app.post('/modules', AuthMiddleware.isAdmin, ValidateMiddleware.validateTrainingModule, TrainingModuleController.createTrainingModule);
app.get('/modules', TrainingModuleController.getAllModules);
app.get('/modules/:id', TrainingModuleController.getTrainingModule);
app.put('/modules/:id', AuthMiddleware.isAdmin, ValidateMiddleware.validateTrainingModule, TrainingModuleController.updateTrainingModule);
app.delete('/modules/:id', AuthMiddleware.isAdmin, TrainingModuleController.deleteModule);

// Routes for quizzes
app.post('/quizzes', AuthMiddleware.isAdmin, QuizController.createQuiz);
app.get('/quizzes', QuizController.getAllQuizzes);
app.get('/quizzes/:id', QuizController.getQuizById);
app.put('/quizzes/:id', AuthMiddleware.isAdmin, QuizController.updateQuiz);
app.delete('/quizzes/:id', AuthMiddleware.isAdmin, QuizController.deleteQuiz);

// Routes for user progress and reporting
app.get('/reports/progress', AuthMiddleware.isAdmin, ReportController.getAllProgress);
app.get('/reports/progress/:userId', AuthMiddleware.isAdmin, ReportController.getUserProgress);
app.get('/reports/export', AuthMiddleware.isAdmin, ReportController.exportReport);

// Default route for all other endpoints
app.get('/', (req, res) => {
  res.send('Welcome to the CS205-A2 Training Platform');
});

// Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
