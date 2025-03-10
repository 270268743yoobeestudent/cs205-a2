const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Importing the User model

/**
 * Middleware to check if the user is authenticated
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Retrieve token from Authorization header (case-insensitive)
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      console.warn("Authentication failed: No token provided.");
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) {
      console.warn("Authentication failed: Invalid token payload.");
      return res.status(401).json({ message: "Invalid token." });
    }

    // Find the user associated with the token
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password from the retrieved data
    if (!user) {
      console.warn(`Authentication failed: User ID ${decoded.userId} not found.`);
      return res.status(401).json({ message: "User not found." });
    }

    // Attach the authenticated user to the request object
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Authentication error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }

    return res.status(401).json({ message: "Invalid token.", error: err.message });
  }
};

/**
 * Middleware for admin-only access
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    console.warn("Authorization failed: Admin access required.");
    return res.status(403).json({ error: "Forbidden: Admin access required." });
  }
  next();
};

/**
 * General role-check middleware (supports multiple roles)
 * @param {...string} roles - Allowed roles
 */
const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.warn(`Authorization failed: Requires one of the roles: ${roles.join(", ")}.`);
      return res.status(403).json({
        error: `Forbidden: Requires one of the roles: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

// Ensure JWT secret is set at runtime
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in the environment variables. Application will terminate.");
  process.exit(1); // Exit the application if JWT_SECRET is missing
}

module.exports = {
  authenticateToken,
  isAdmin,
  hasRole,
};
