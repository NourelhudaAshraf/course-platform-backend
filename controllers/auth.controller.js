const env = require("../config/env");
const catchAsync = require("../utils/catch-async");
const ms = require("ms");
const {
  signupService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
  updatePasswordService,
} = require("../services/auth.service");

const sendTokenCookies = (res, token) => {
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + ms(env.JWT_EXPIRES_IN)),
    httpOnly: true,
    secure: env.NODE_ENV === "development" ? false : true,
    sameSite: env.NODE_ENV === "development" ? "lax" : "none",
  });
};

const logoutCookies = (res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: env.NODE_ENV !== "development",
    sameSite: env.NODE_ENV === "development" ? "lax" : "none",
  });
};

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const { user, token } = await signupService(name, email, password);
  sendTokenCookies(res, token);
  res.status(201).json({
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await loginService(email, password);
  sendTokenCookies(res, token);
  res.status(200).json({
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

const logout = (req, res) => {
  logoutCookies(res);
  res.status(200).json({
    status: "success",
  });
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const { message } = await forgotPasswordService(req.body.email);
  res.status(200).json({ status: "success", message });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  const tokenGenerated = await resetPasswordService(token, password);
  sendTokenCookies(res, tokenGenerated);
  res
    .status(200)
    .json({ status: "success", message: "Password reset successfully" });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const token = await updatePasswordService(
    req.user._id,
    currentPassword,
    newPassword,
  );
  sendTokenCookies(res, token);
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
};
