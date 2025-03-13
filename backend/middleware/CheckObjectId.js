const mongoose = require("mongoose");

/**
 * Middleware to check if a parameter is a valid MongoDB ObjectId
 * @param {string} paramName - The name of the route parameter to validate (e.g., "employeeId")
 */
const checkObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn(`Invalid ObjectId format for ${paramName}: ${id}`);
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format.`,
      });
    }

    // Proceed to the next middleware if valid
    next();
  };
};

module.exports = checkObjectId;
