require("dotenv").config(); // Load environment variables FIRST

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/AuthRoutes");
const trainingRoutes = require("./routes/TrainingModuleRoutes");
const quizRoutes = require("./routes/QuizRoutes");
const reportRoutes = require("./routes/ReportRoutes");
const adminRoutes = require("./routes/AdminRoutes");

console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging (Remove in production)

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
app.use("/auth", authRoutes);
app.use("/training", trainingRoutes);
app.use("/quizzes", quizRoutes);
app.use("/reports", reportRoutes);
app.use("/admin", adminRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Cybersecurity Training API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);  // Log the error for debugging
  res.status(500).json({ message: "An unexpected error occurred." });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("Server shutting down...");
  mongoose.connection.close(() => {
    console.log("MongoDB disconnected");
    process.exit(0);
  });
});
