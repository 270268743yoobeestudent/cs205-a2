const mongoose = require("mongoose");

const checkObjectId = (param) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    return res.status(400).json({ message: "Invalid ObjectId format" });
  }
  next();
};

module.exports = checkObjectId;
