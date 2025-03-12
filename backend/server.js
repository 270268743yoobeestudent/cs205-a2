require("dotenv").config(); // Load environment variables at the very beginning

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); // For parsing cookies
const cors = require("cors"); // To handle cross-origin requests
const session = require("express-session"); // For session handling
const MongoStore = require("connect-mongo"); // For storing sessions in MongoDB
const errorHandler = require("./middleware/ErrorHandler"); // Centralized error handler
const rateLimiter = require("./middleware/RateLimiter"); // Rate limiting middleware
const requestLogger = require("./middleware/RequestLogger"); // Request logging middleware

const AuthRoutes = require("./routes/AuthRoutes"); // Authentication routes
const UserRoutes = require("./routes/UserRoutes"); // User-specific routes
const AdminRoutes = require("./routes/AdminRoutes"); // Admin-specific routes
const QuizRoutes = require("./routes/QuizRoutes"); // Quiz-related routes
const TrainingModuleRoutes = require("./routes/TrainingModuleRoutes"); // Training module routes

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies

// Add the RequestLogger middleware AFTER JSON and cookie parsers
app.use(requestLogger);

// Configure CORS Middleware with Debugging
app.use(
  (req, res, next) => {
    console.log("CORS Debug: Origin:", req.headers.origin);
    next();
  },
  cors({
    origin: "http://localhost:3000", // Allow requests only from the local frontend
    credentials: true, // Allow cookies in CORS requests
  })
);

// Apply Rate Limiting Middleware
app.use(rateLimiter);

// Configure Session Middleware with Debugging
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret", // Replace with a secure key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Store sessions in MongoDB
      collectionName: "sessions", // Name for the sessions collection
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true, // Prevent client-side JavaScript access
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiry
    },
  })
);

// Debug Session Middleware
app.use((req, res, next) => {
  console.log("Session Debug - ID:", req.sessionID);
  console.log("Session Debug - Data:", req.session);
  next();
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI) // Removed deprecated options
  .then(() => {
    console.log(`MongoDB connected successfully`);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes

// Welcome Route for Root URL (http://localhost:5000/)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Backend API!",
  });
});

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

// API Routes
app.use("/api/auth", AuthRoutes); // Authentication endpoints
app.use("/api/users", UserRoutes); // User-specific endpoints
app.use("/api/admin", AdminRoutes); // Admin-specific endpoints
app.use("/api/quizzes", QuizRoutes); // Quiz-related endpoints
app.use("/api/modules", TrainingModuleRoutes); // Training module endpoints

// Fallback Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Centralized Error Handler (should always come last)
app.use(errorHandler);

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Graceful shutdown initiated...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
