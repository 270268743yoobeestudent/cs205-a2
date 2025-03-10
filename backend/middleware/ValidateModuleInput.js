/**
 * Middleware to validate input for training modules
 * Ensures that the module name and description are provided in the request body.
 */
const validateModuleInput = (req, res, next) => {
  const { name, description } = req.body;

  // Validate required fields
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: "Module name and description are required.",
    });
  }

  next(); // Proceed to the next middleware or route handler
};

module.exports = validateModuleInput;
