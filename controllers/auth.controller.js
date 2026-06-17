const User = require("../models/Users");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
// const { validationResult } = require("express-validator");
// const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sentTokenCookies = (res, token) => {
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //ms
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
    if (!name || !email || !password) {
      return next({ status: 400, message: "Invalid data" });
    }
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
  if (!email || !password) {
    return next({ status: 400, message: "Invalid data" });
  }

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

module.exports = {
  signup,
  login,
  getMe,
  logout,
};
