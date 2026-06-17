const sendEmail = require("../config/email");
const User = require("../models/user.model");
const catchAsync = require("../utils/catch-async");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { buildHtmlEmail } = require("../utils/helpers");
const ms = require("ms");
// const { validationResult } = require("express-validator");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sentTokenCookies = (res, token) => {
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN)),
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
  });
};

const signup = catchAsync(async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return next({ status: 400, message: errors.array()[0].msg });
  // }
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, role: "user" });
    const token = signToken(user._id);
    sentTokenCookies(res, token);

    res.status(201).json({
      status: "success",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return next({ status: 400, message: "Email already exists" });
    }
    return next({ status: 400, message: err.message });
  }
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next({ status: 401, message: "Invalid email or password" });
  }
  const token = signToken(user._id);
  sentTokenCookies(res, token);
  res.status(200).json({
    status: "success",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

const getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

const logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next({ status: 404, message: "User not found" });
  }
  const resetToken = user.createResetPasswordToken();
  await user.save();
  const resetUrl = `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  try {
    await sendEmail(user.email, "Password Reset", buildHtmlEmail(resetUrl));
    res.status(200).json({ status: "success", message: "Email sent" });
  } catch (err) {
    console.log("error sending email: ", err.message);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return next({ status: 500, message: "Email not sent" });
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  // 1) Get user based on the token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+password");
  if (!user) {
    return next({ status: 400, message: "Token is invalid or has expired!" });
  }
  if (await user.correctPassword(password, user.password)) {
    return next({
      status: 400,
      message: "New password cannot be the same as the current password!",
    });
  }
  // 2) If token is valid, update the user's password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // 3) Login the user
  const tokenGenerated = signToken(user._id);
  sentTokenCookies(res, tokenGenerated);
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!user || !(await user.correctPassword(currentPassword, user.password))) {
    return next({ status: 401, message: "Incorrect password!" });
  }
  if (await user.correctPassword(newPassword, user.password)) {
    return next({
      status: 400,
      message: "New password cannot be the same as the old password!",
    });
  }
  user.password = newPassword;
  await user.save();

  const token = signToken(user._id);
  sentTokenCookies(res, token);
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

module.exports = {
  signup,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
};
