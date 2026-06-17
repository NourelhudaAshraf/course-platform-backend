const User = require("../models/user.model");
const catchAsync = require("../utils/catch-async");
const { getAllDocs, getOne } = require("../utils/handle-factory");
const UserLesson = require("../models/user-lesson.model");
const Enrollment = require("../models/enrollment.model");

const getAllUsers = getAllDocs(User);
const getUserById = getOne(User);

const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return next({ status: 404, message: "Item not found!" });
  await Promise.all([
    UserLesson.deleteMany({ user: id }),
    Enrollment.deleteMany({ user: id }),
  ]);
  await User.findByIdAndDelete(id);
  res.status(204).send();
});

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
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: "admin" },
    { new: true },
  );
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
