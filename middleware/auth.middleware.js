const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

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
    }
    if (!token) {
      return next({ status: 401, message: "You are not logged in!" });
    }
    // verify returns payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next({ status: 401, message: "Invalid token!" });
    }

    req.user = currentUser;
    next();
  } catch (e) {
    console.log("error: ", e.message);
    return next({ status: 401, message: "Invalid token or token expired!" });
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

module.exports = {
  protect,
  restrictTo,
};
