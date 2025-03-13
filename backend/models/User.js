const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
      required: [true, "Role is required"],
    },
    // Store quiz results as an array of objects, including the quizId, score, and totalQuestions
    quizResults: [
      {
        quiz: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quiz", // Refers to the Quiz model
          required: true,
        },
        score: {
          type: Number,
          min: [0, "Score cannot be negative"],
          required: true,
        },
        totalQuestions: {
          type: Number,
          min: [1, "Total questions must be at least 1"],
          required: true,
        },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    // Store completed modules as references to the TrainingModule model
    completedModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrainingModule", // Refers to the TrainingModule model
      },
    ],
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "default-profile.png", // Default profile picture
    },
    lastLogin: { type: Date },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Hash password before saving it to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip hashing if password is not modified
  this.password = await bcrypt.hash(this.password, 10); // Hash the password with bcrypt
  next();
});

// Compare the provided password with the stored hashed password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
