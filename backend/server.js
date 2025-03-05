const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/AuthRoutes"); // Add this line to import authRoutes
const trainingRoutes = require("./routes/TrainingModuleRoutes");
const quizRoutes = require("./routes/QuizRoutes");
const reportRoutes = require("./routes/ReportRoutes");
const adminRoutes = require("./routes/AdminRoutes"); // New Admin Routes

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Connection Error:", error));

// Routes
app.use("/auth", authRoutes); // Add this route for authentication
app.use("/training", trainingRoutes);
app.use("/quizzes", quizRoutes);
app.use("/reports", reportRoutes);
app.use("/admin", adminRoutes); // New Admin Route for Reports

// Default Route
app.get("/", (req, res) => {
  res.send("Cybersecurity Training API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
