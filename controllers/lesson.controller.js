const Lesson = require("../models/lesson.model");
const {
  getAllDocs,
  getOne,
  updateOne,
  createOne,
} = require("../utils/handle-factory");
const catchAsync = require("../utils/catch-async");
const {
  getLessonsWithoutVideoService,
  deleteLessonService,
} = require("../services/lesson.service");

const getAllLessons = getAllDocs(Lesson, null, {
  path: "course",
  select: "title",
});

const getLessonsWithoutVideo = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId || req.body.course;
  if (!courseId) return next({ status: 400, message: "Course ID is required" });
  const lessons = await getLessonsWithoutVideoService(courseId);
  res.status(200).json({ status: "success", data: lessons });
});

const getLessonById = getOne(Lesson, { path: "course", select: "title" });
const updateLessonById = updateOne(Lesson);
const createLesson = createOne(Lesson);

const deleteLesson = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await deleteLessonService(id);
  res.status(204).send();
});

module.exports = {
  getAllLessons,
  getLessonsWithoutVideo,
  createLesson,
  getLessonById,
  updateLessonById,
  deleteLesson,
};
