/**
 * Middleware to validate input for training modules
 * Ensures that the module title and description are provided in the request body.
 */
const validateModuleInput = (req, res, next) => {
  const { title, description } = req.body; // Update to check for 'title' instead of 'name'

  // Validate required fields
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Module title and description are required.",
    });
  }

  next(); // Proceed to the next middleware or route handler
};

module.exports = validateModuleInput;
