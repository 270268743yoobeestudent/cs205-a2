const User = require("../models/User");

// Login Endpoint
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Save user details to session
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    console.log("Session after login:", req.session); // Debugging session data

    // Respond to the client
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.session.user
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Register Endpoint (Optional for Admins to Add Users)
exports.register = async (req, res) => {
  const { username, password, firstName, lastName, email, role } = req.body;

  try {
    const user = new User({ username, password, firstName, lastName, email, role });
    await user.save();

    // Respond without auto-login
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout Endpoint
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }

    res.clearCookie("connect.sid"); // Clear session cookie
    res.status(200).json({ success: true, message: "Logout successful" });
  });
};

// Validate Session Endpoint
exports.validateSession = (req, res) => {
  console.log("Session Validation: req.session", req.session);

  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No active session",
    });
  }

  res.status(200).json({
    success: true,
    role: req.session.user.role, // Return the user's role
  });
};
