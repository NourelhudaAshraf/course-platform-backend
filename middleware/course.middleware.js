const catchAsync = require("../utils/catch-async");
const { destroyFromUrl } = require("../utils/cloudinary");
const { uploadFileToCloudinary } = require("../utils/helpers");
const Course = require("../models/course.model");

const setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

const authorizedToEditCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next({
      status: 404,
      message: "Course not found",
    });
  }
  if (!course.user.equals(req.user._id)) {
    return next({
      status: 403,
      message: "You are not authorized to edit this course",
    });
  }
  req.course = course;
  next();
});

const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const { secure_url } = await uploadFileToCloudinary(req.file, "courses");
  req.body.image = secure_url;
  if (req.course?.image) await destroyFromUrl(req.course.image);
  next();
});

module.exports = {
  setUserId,
  authorizedToEditCourse,
  uploadImage,
};
