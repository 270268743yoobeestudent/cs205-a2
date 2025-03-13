const { body, validationResult } = require("express-validator");

const validateRegister = [
  // Trim inputs to avoid issues with leading/trailing spaces
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),
  body("email")
    .trim() // Trim email input
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .trim() // Trim password input
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/)
    .withMessage(
      "Password must include at least one uppercase, one lowercase, one number, and one special character"
    ),
  body("role")
    .optional()
    .isIn(["admin", "employee"])
    .withMessage("Role must be either 'admin' or 'employee'"),

  // Validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = validateRegister;
