const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const catchAsync = require("../utils/catch-async");

const requireEnrollment = catchAsync(async (req, res, next) => {
  if (req.user.role === "admin") return next();

  const lessonId = req.params.id || req.params?.lessonId || req.body?.lessonId;
  const courseId = req.params?.courseId;

  if (!lessonId && !courseId) {
    return next({ status: 400, message: "Lesson or course ID required" });
  }

  let courseToCheck = courseId;

  if (lessonId) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return next({ status: 404, message: "Lesson not found" });
    if (courseId && String(lesson.course) !== String(courseId)) {
      return next({ status: 404, message: "Lesson not found" });
    }
    courseToCheck = lesson.course;
  } else {
    const course = await Course.findById(courseId);
    if (!course) return next({ status: 404, message: "Course not found" });
  }

  const enrolled = await Enrollment.findOne({
    user: req.user._id,
    course: courseToCheck,
  });
  if (!enrolled) {
    return next({ status: 403, message: "Not enrolled in this course" });
  }
  next();
});

module.exports = {
  requireEnrollment,
};
