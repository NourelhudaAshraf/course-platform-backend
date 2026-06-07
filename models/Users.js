const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: 8,
    select: false, // to not return the password in the response
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) {
    return typeof next === "function" ? next() : undefined;
  }
  // 12 refers to the number of rounds of hashing helps to make the password more secure
  this.password = await bcrypt.hash(this.password, 12);
});

// add this method to the userSchema to compare the password
// can access by document
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  // this.password -> i can not use this because its select: false
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
