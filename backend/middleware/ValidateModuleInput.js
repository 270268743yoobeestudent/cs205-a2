// Middleware for validating training module input
const validateModuleInput = (req, res, next) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Module name and description are required." });
  }

  next(); // Proceed if validation passes
};

module.exports = validateModuleInput;
