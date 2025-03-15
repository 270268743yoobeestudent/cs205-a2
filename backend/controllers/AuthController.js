// backend/controllers/authController.js
const User = require('../models/User');

exports.login = async (req, res) => {
    console.log("Login request received:", req.body);
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        console.log("User not found");
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      console.log("User found:", user);
      const isMatch = await user.comparePassword(req.body.password);
      console.log("Password match:", isMatch);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
      // Create session
      req.session.userId = user._id;
      req.session.role = user.role;
      res.json({ message: 'Logged in successfully', user: { id: user._id, username: user.username, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };  

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};
