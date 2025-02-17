// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialise Express
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Enable CORS

// Connect to MongoDB
connectDB();

// Base route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the cs205-a2 backend API!');
});

// Import and use the training module routes
const trainingModuleRoutes = require('./routes/TrainingModuleRoutes');
app.use('/api/modules', trainingModuleRoutes);

// Import and use the quiz routes
const quizRoutes = require('./routes/QuizRoutes');
app.use('/api/quizzes', quizRoutes);

// Define the port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
