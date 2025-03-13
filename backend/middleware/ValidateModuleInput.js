/**
 * Middleware to validate input for training modules
 * Ensures that the module title and description are provided in the request body.
 */
const validateModuleInput = (req, res, next) => {
  const { title, description } = req.body;

  // Trim the inputs to remove leading and trailing spaces
  req.body.title = title ? title.trim() : '';
  req.body.description = description ? description.trim() : '';

  // Validate required fields
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Module title and description are required.",
    });
  }

  // Validate title length (example: between 5 and 100 characters)
  if (title.length < 5 || title.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Module title must be between 5 and 100 characters.",
    });
  }

  // Validate description length (example: between 10 and 500 characters)
  if (description.length < 10 || description.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Module description must be between 10 and 500 characters.",
    });
  }

  next(); // Proceed to the next middleware or route handler
};

module.exports = validateModuleInput;
