const User = require("../models/user.model");
const UserLesson = require("../models/user-lesson.model");
const Enrollment = require("../models/enrollment.model");

const deleteUserService = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error("User not found!");
    error.status = 404;
    throw error;
  }
  if (user.role === "admin") {
    const error = new Error("Admins cannot be deleted!");
    error.status = 400;
    throw error;
  }
  await Promise.all([
    UserLesson.deleteMany({ user: id }),
    Enrollment.deleteMany({ user: id }),
  ]);
  await User.findByIdAndDelete(id);
  return true;
};

const updateMeService = async (user, body) => {
  if (body.email) {
    const existingUser = await User.findOne({
      email: body.email,
      _id: { $ne: user._id },
    });
    if (existingUser) {
      const error = new Error("Email already exists");
      error.status = 400;
      throw error;
    }
  }
  const updatedUser = await User.findByIdAndUpdate(user._id, body, {
    new: true,
    runValidators: true,
  });
  return updatedUser;
};

const getLatestUsersService = async () => {
  const latestUsers = await User.find({ role: "user" })
    .sort("-createdAt")
    .limit(4);
  return latestUsers;
};

const promoteUserToAdminService = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { role: "admin" },
    { new: true },
  );
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};

module.exports = {
  deleteUserService,
  updateMeService,
  getLatestUsersService,
  promoteUserToAdminService,
};
