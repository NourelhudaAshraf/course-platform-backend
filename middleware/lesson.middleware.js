const catchAsync = require("../utils/catch-async");
const { destroyFromUrl } = require("../utils/cloudinary");
const { uploadFileToCloudinary } = require("../utils/helpers");
const Lesson = require("../models/lesson.model");
const Course = require("../models/course.model");

const setCourseId = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  next();
};

const uploadVideo = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const lessonId = req.params.id;
  if (lessonId) {
    const lesson = await Lesson.findById(lessonId).select("videoUrl");
    if (lesson?.videoUrl) await destroyFromUrl(lesson.videoUrl);
  }
  const { secure_url, duration } = await uploadFileToCloudinary(
    req.file.buffer,
    "lessons",
  );

  req.body.videoUrl = secure_url;
  if (duration != null) {
    req.body.totalSeconds = Math.round(duration);
  }
  next();
});

const assertLessonInCourse = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id).populate(
    "course",
    "user",
  );
  if (!lesson || String(lesson.course._id) !== String(req.params.courseId)) {
    return next({ status: 404, message: "Lesson not found in this course" });
  }
  req.lesson = lesson;
  next();
});

const authorizedToEditLesson = (req, res, next) => {
  if (!req.lesson.course.user.equals(req.user._id)) {
    return next({
      status: 403,
      message: "You are not authorized to edit this lesson",
    });
  }
  next();
};
module.exports = {
  setCourseId,
  uploadVideo,
  assertLessonInCourse,
  authorizedToEditLesson,
};
