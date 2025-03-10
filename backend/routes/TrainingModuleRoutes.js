const express = require("express");
const router = express.Router();
const TrainingModuleController = require("../controllers/TrainingModuleController");
const { authenticateToken, isAdmin } = require("../middleware/AuthMiddleware");
const validateModuleInput = require("../middleware/ValidateModuleInput");

// Admin only: Route to create a new training module
router.post("/", authenticateToken, isAdmin, validateModuleInput, async (req, res, next) => {
  try {
    const newModule = await TrainingModuleController.createModule(req.body);
    res.status(201).json({ success: true, data: newModule });
  } catch (error) {
    next(error); // Pass error to centralized error handling middleware
  }
});

// Admin only: Route to retrieve all training modules
router.get("/", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const modules = await TrainingModuleController.getModules();
    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    next(error);
  }
});

// Admin only: Route to retrieve a single module by its ID
router.get("/:id", authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Module ID is required" });
    }

    const module = await TrainingModuleController.getModuleById(id);
    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    res.status(200).json({ success: true, data: module });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
