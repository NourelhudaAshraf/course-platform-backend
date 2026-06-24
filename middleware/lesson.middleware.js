const catchAsync = require("../utils/catch-async");
const { destroyFromUrl } = require("../utils/cloudinary");
const { uploadFileToCloudinary } = require("../utils/helpers");
const Lesson = require("../models/lesson.model");

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
    req.file,
    "lessons",
  );

  req.body.videoUrl = secure_url;
  if (duration != null) {
    req.body.totalSeconds = Math.round(duration);
  }
  next();
});

module.exports = {
  setCourseId,
  uploadVideo,
};
