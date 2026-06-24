const catchAsync = require("../utils/catch-async");
const {
  watchLessonService,
  getCompletedLessonsService,
} = require("../services/user-lesson.service");

const watchLesson = catchAsync(async (req, res, next) => {
  const { lessonId, lastPosition } = req.body;
  const lesson = await watchLessonService(req.user, lessonId, lastPosition);
  res.status(200).json({ status: "success", data: lesson });
});

const getCompletedLessons = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const userLessons = await getCompletedLessonsService(req.user, courseId);
  res.status(200).json({
    status: "success",
    data: userLessons,
  });
});

module.exports = {
  watchLesson,
  getCompletedLessons,
};
