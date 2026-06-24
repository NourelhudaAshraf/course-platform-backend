const Lesson = require("../models/lesson.model");
const UserLesson = require("../models/user-lesson.model");
const { destroyFromUrl } = require("../utils/cloudinary");

const getLessonsWithoutVideoService = async (courseId) => {
  const lessons = await Lesson.find({ course: courseId })
    .populate("course", "title")
    .select("-videoUrl -totalSeconds");
  return lessons;
};

const deleteLessonService = async (id) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) {
    const error = new Error("Lesson not found!");
    error.status = 404;
    throw error;
  }
  if (lesson.videoUrl) await destroyFromUrl(lesson.videoUrl);
  await UserLesson.deleteMany({ lesson: id });
  await Lesson.findByIdAndDelete(id);
  return true;
};

module.exports = {
  getLessonsWithoutVideoService,
  deleteLessonService,
};
