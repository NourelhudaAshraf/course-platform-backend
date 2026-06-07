const UserLesson = require("../models/UserLessons");
const User = require("../models/Users");
const Lesson = require("../models/Lessons");
const catchAsync = require("../utils/catchAsync");

const watchLesson = catchAsync(async (req, res, next) => {
  const { lessonId, lastPosition } = req.body;
  const user = await User.findById(req.user._id);
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return next(new AppError("Lesson not found", 404));
  }
  const userLesson = await UserLesson.findOne({
    user: user._id,
    lesson: lessonId,
  });
  if (!userLesson) {
    //add to database
    const newUserLesson = await UserLesson.create({
      user: user._id,
      lesson: lessonId,
      lastPosition: lastPosition,
      progress: `${(lastPosition / lesson.totalSeconds) * 100}%`,
      completed: lastPosition >= lesson.totalSeconds,
    });
    return res.status(201).json({
      status: "success",
      data: newUserLesson,
    });
  } else {
    //update in database
    const newLastPosition = Math.max(userLesson.lastPosition, lastPosition);
    userLesson.lastPosition = newLastPosition;
    userLesson.progress = `${(newLastPosition / lesson.totalSeconds) * 100}%`;
    userLesson.completed = newLastPosition >= lesson.totalSeconds;
    await userLesson.save();
    return res.status(200).json({
      status: "success",
      data: userLesson,
    });
  }
});

const getLessonProgress = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const user = await User.findById(req.user._id);
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return next(new AppError("Lesson not found", 404));
  }
  const userLesson = await UserLesson.findOne({
    user: user._id,
    lesson: lessonId,
  });
  return res.status(200).json({
    status: "success",
    data: userLesson ? userLesson.progress : "0%",
  });
});

const getCompletedLessons = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const lessons = await Lesson.find({ course: courseId }).select("_id");
  const lessonIds = lessons.map((l) => l._id);

  const userLessons = await UserLesson.find({
    user: req.user._id,
    lesson: { $in: lessonIds },
  }).select("lesson completed lastPosition");

  res.status(200).json({
    status: "success",
    data: userLessons,
  });
});

module.exports = {
  watchLesson,
  getLessonProgress,
  getCompletedLessons,
};
