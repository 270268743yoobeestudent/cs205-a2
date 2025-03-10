const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links Admin to a User entry
      required: [true, "User ID is required"],
    },
    permissions: {
      type: [String], // Array of permissions (e.g., "manageUsers", "viewReports")
      default: [], // Optional if admins don't have custom permissions
    },
    department: {
      type: String,
      default: "General",
      trim: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Exporting the Admin model
module.exports = mongoose.model("Admin", AdminSchema);
