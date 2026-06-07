const User = require("../models/Users");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
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
    secure: false,
    sameSite: "lax",
    // secure: true, only production
  });
};

const signup = catchAsync(async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return next({ status: 400, message: "Invalid data" });
    }
    const user = await User.create({ name, email, password, role });
    const token = signToken(user._id);
    sentTokenCookies(res, token);

    res.status(201).json({
      status: "success",
      token,
      data: user,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next({ status: 400, message: "Invalid data" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next({ status: 400, message: "Invalid email or password" });
  }
  const token = signToken(user._id);
  sentTokenCookies(res, token);
  res.status(201).json({
    status: "success",
    token,
    data: user,
  });
});

const protect = async (req, res, next) => {
  try {
    // Check if token is provided
    const { authorization } = req.headers;
    // console.log(req.headers);
    // console.log("cookie", req.cookies);
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.cookie) {
      token = req.headers.cookie.split("=")[1];
    }
    if (!token) {
      return next({ status: 401, message: "You are not logged in!" });
    }
    // verify returns payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next({ status: 404, message: "User not found!" });
    }

    req.user = currentUser;
    next();
  } catch (e) {
    console.log("error: ", e.message);
    return next({ status: 401, message: e.message });
  }
};

// takes arguments as an array of roles and returns a middleware function
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next({
        status: 403,
        message: "You are not authorized to access this resource!",
      });
    }
    next();
  };
};

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
  protect,
  restrictTo,
  getMe,
  logout,
};
