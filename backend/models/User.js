const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,  // Ensure no leading or trailing spaces
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,  // Ensure a valid role is always set
    },
    quizResults: [
      {
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
        score: { type: Number, min: [0, "Score cannot be negative"], required: true },
        totalQuestions: { type: Number, min: [1, "Total questions must be at least 1"], required: true },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "default-profile.png",
    },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
  }
);

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare entered password with stored hash
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Custom method to check if user is an admin
UserSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

// Indexing for performance optimization (optional)
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

module.exports = mongoose.model("User", UserSchema);
