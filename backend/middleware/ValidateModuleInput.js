const validateModuleInput = (req, res, next) => {
  const { title, description, content } = req.body;

  // Check if required fields are missing
  if (!title || !description || !content) {
    const missingFields = [];
    
    if (!title) missingFields.push("Title");
    if (!description) missingFields.push("Description");
    if (!content) missingFields.push("Content");

    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}.`
    });
  }

  // Proceed to the next middleware if validation is successful
  next();
};

module.exports = validateModuleInput;
