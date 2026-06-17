const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Enrollment = require("../models/enrollment.model");
const UserLesson = require("../models/user-lesson.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const catchAsync = require("../utils/catch-async");
const {
  getAllDocs,
  getOne,
  updateOne,
  createOne,
} = require("../utils/handle-factory");

const getAllCourses = getAllDocs(Course, null, {
  path: "user",
  select: "name",
});
const getCourseById = getOne(Course, { path: "user", select: "name" });
const updateCourseById = updateOne(Course);
const createCourse = createOne(Course);
const deleteCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    return next({ status: 404, message: "Item not found!" });
  }

  const lessonIds = await Lesson.find({ course: id }).distinct("_id");

  await Promise.all([
    UserLesson.deleteMany({ lesson: { $in: lessonIds } }),
    Lesson.deleteMany({ course: id }),
    Enrollment.deleteMany({ course: id }),
  ]);

  await Course.findByIdAndDelete(id);

  res.status(204).send();
});

//middleware
const setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

const authorizedToEditCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course.user.equals(req.user._id)) {
    return next({
      status: 403,
      message: "You are not authorized to edit this course",
    });
  }
  next();
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next();
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "courses" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    req.body.image = result.secure_url;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  updateCourseById,
  createCourse,
  deleteCourse,
  setUserId,
  uploadImage,
  authorizedToEditCourse,
};
