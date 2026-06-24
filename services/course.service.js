const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Enrollment = require("../models/enrollment.model");
const UserLesson = require("../models/user-lesson.model");
const { destroyFromUrl } = require("../utils/cloudinary");

const deleteCourseService = async (courseData, id) => {
  const course = courseData ? courseData : await Course.findById(id);
  if (!course) {
    const error = new Error("Course not found!");
    error.status = 404;
    throw error;
  }

  const lessons = await Lesson.find({ course: id }).select("videoUrl");
  const lessonIds = lessons.map((lesson) => lesson._id);

  const cloudinaryDeletes = [];
  if (course.image) cloudinaryDeletes.push(destroyFromUrl(course.image));
  lessons.forEach((lesson) => {
    if (lesson.videoUrl)
      cloudinaryDeletes.push(destroyFromUrl(lesson.videoUrl));
  });
  await Promise.allSettled(cloudinaryDeletes);

  await Promise.all([
    UserLesson.deleteMany({ lesson: { $in: lessonIds } }),
    Lesson.deleteMany({ course: id }),
    Enrollment.deleteMany({ course: id }),
  ]);
  await Course.findByIdAndDelete(id);
  return true;
};

module.exports = {
  deleteCourseService,
};
