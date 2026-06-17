const User = require("../models/Users");
const catchAsync = require("../utils/catchAsync");
const { getAllDocs, getOne, updateOne, deleteOne } = require("./handleFactory");

const getAllUsers = getAllDocs(User);
const getUserById = getOne(User);
const deleteUser = deleteOne(User);

const filteredBody = (body, ...allowedFields) => {
  const newBody = {};
  Object.keys(body).forEach((key) => {
    if (allowedFields.includes(key)) {
      newBody[key] = body[key];
    }
  });
  return newBody;
};

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next({
      status: 400,
      message: "This route is not for password updates",
    });
  }
  const filtered = filteredBody(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filtered, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

const getLatestUsers = catchAsync(async (req, res, next) => {
  const latestUsers = await User.find({ role: "user" })
    .sort("-createdAt")
    .limit(4);
  res.status(200).json({
    status: "success",
    data: latestUsers,
  });
});

const promoteUserToAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: "admin" });
  if (!user) {
    return next({ status: 404, message: "User not found" });
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateMe,
  getLatestUsers,
  promoteUserToAdmin,
};
