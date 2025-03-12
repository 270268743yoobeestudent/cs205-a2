/**
 * Middleware to check if the user is authenticated
 */
const isAuthenticated = (req, res, next) => {
  try {
    // Check if the user session exists
    if (!req.session || !req.session.user) {
      console.warn("Authentication failed: No active session.");
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Attach the user session to the request object
    req.user = req.session.user;

    console.log("Authenticated user:", req.user); // Debugging

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Authentication error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Middleware for admin-only access
 */
const isAdmin = (req, res, next) => {
  try {
    // Check if the user is authenticated and has the "admin" role
    if (!req.session || !req.session.user || req.session.user.role !== "admin") {
      console.warn("Authorization failed: Admin access required.");
      return res.status(403).json({ message: "Forbidden: Admin access required." });
    }

    console.log("Admin access granted to user:", req.session.user.username); // Debugging

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Authorization error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * General role-check middleware (supports multiple roles)
 * @param {...string} roles - Allowed roles
 */
const hasRole = (...roles) => {
  return (req, res, next) => {
    try {
      // Check if the user is authenticated and their role matches the allowed roles
      if (!req.session || !req.session.user || !roles.includes(req.session.user.role)) {
        console.warn(`Authorization failed: Requires one of the roles: ${roles.join(", ")}.`);
        return res.status(403).json({
          message: `Forbidden: Requires one of the roles: ${roles.join(", ")}`,
        });
      }

      console.log(`Access granted to user: ${req.session.user.username} with role: ${req.session.user.role}`); // Debugging

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      console.error("Authorization error:", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = {
  isAuthenticated,
  isAdmin,
  hasRole,
};
