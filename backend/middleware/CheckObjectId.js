const mongoose = require("mongoose");

/**
 * Middleware to check if a parameter is a valid MongoDB ObjectId
 * @param {string} paramName - The name of the route parameter to validate (e.g., "employeeId")
 */
const checkObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format.`,
      });
    }

    next(); // Proceed if validation passes
  };
};

module.exports = checkObjectId;
