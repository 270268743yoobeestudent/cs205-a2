const validateModuleInput = (req, res, next) => {
    const { title, description, content } = req.body;
    
    if (!title || !description || !content) {
      return res.status(400).json({ message: 'Title, description, and content are required.' });
    }
    
    next(); // Proceed if validation is successful
  };
  
  module.exports = validateModuleInput;
  