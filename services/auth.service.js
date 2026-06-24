const sendEmail = require("../config/email");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { buildHtmlEmail } = require("../utils/helpers");
const env = require("../config/env");

const signToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const signupService = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already exists");
    error.status = 400;
    throw error;
  }
  const newUser = await User.create({ name, email, password, role: "user" });
  const token = signToken(newUser._id);
  newUser.password = undefined;
  return { user: newUser, token };
};

const loginService = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }
  const token = signToken(user._id);
  user.password = undefined;
  return { user, token };
};

const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  const resetToken = user.createResetPasswordToken();
  await user.save();
  const resetUrl = `${env.NODE_ENV === "development" ? "http://localhost:3000" : env.FRONTEND_URL}/reset-password/${resetToken}`;
  try {
    await sendEmail(user.email, "Password Reset", buildHtmlEmail(resetUrl));
    return { message: "Email sent" };
  } catch (err) {
    console.error("error sending email: ", err.message);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    const error = new Error("Email not sent");
    error.status = 500;
    throw error;
  }
};

const resetPasswordService = async (token, password) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+password");
  if (!user) {
    const error = new Error("Token is invalid or has expired!");
    error.status = 400;
    throw error;
  }
  if (await user.correctPassword(password, user.password)) {
    const error = new Error(
      "New password cannot be the same as the current password!",
    );
    error.status = 400;
    throw error;
  }
  // 2) If token is valid, update the user's password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  // 3) Login the user
  const tokenGenerated = signToken(user._id);
  return tokenGenerated;
};

const updatePasswordService = async (userId, currentPassword, newPassword) => {
  const userDB = await User.findById(userId).select("+password");
  if (
    !userDB ||
    !(await userDB.correctPassword(currentPassword, userDB.password))
  ) {
    const error = new Error("Incorrect password!");
    error.status = 401;
    throw error;
  }
  if (await userDB.correctPassword(newPassword, userDB.password)) {
    const error = new Error(
      "New password cannot be the same as the old password!",
    );
    error.status = 400;
    throw error;
  }
  userDB.password = newPassword;
  userDB.passwordChangedAt = Date.now();
  await userDB.save();
  const token = signToken(userDB._id);
  return token;
};

module.exports = {
  signupService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
  updatePasswordService,
};
