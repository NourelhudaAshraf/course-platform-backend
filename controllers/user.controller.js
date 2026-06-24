const User = require("../models/user.model");
const catchAsync = require("../utils/catch-async");
const { getAllDocs, getOne } = require("../utils/handle-factory");
const {
  deleteUserService,
  updateMeService,
  getLatestUsersService,
  promoteUserToAdminService,
} = require("../services/user.service");

const getAllUsers = getAllDocs(User);
const getUserById = getOne(User);

const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await deleteUserService(id);
  res.status(204).send();
});

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next({
      status: 400,
      message: "This route is not for password updates",
    });
  }
  const updatedUser = await updateMeService(req.user, req.body);
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

const getLatestUsers = catchAsync(async (req, res, next) => {
  const latestUsers = await getLatestUsersService();
  res.status(200).json({
    status: "success",
    data: latestUsers,
  });
});

const promoteUserToAdmin = catchAsync(async (req, res, next) => {
  const user = await promoteUserToAdminService(req.params.id);
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
