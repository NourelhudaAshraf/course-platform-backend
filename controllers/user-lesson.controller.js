const UserLesson = require("../models/user-lesson.model");
const User = require("../models/user.model");
const Lesson = require("../models/lesson.model");
const catchAsync = require("../utils/catch-async");

const watchLesson = catchAsync(async (req, res, next) => {
  const { lessonId, lastPosition } = req.body;
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return next({ status: 404, message: "Lesson not found" });
  }
  const userLesson = await UserLesson.findOne({
    user: req.user._id,
    lesson: lessonId,
  });

  let progress = "0%";
  let completed = false;
  if (!lesson.totalSeconds || lesson.totalSeconds === 0) {
    progress = "0%";
    completed = false;
  } else {
    progress = `${(lastPosition / lesson.totalSeconds) * 100}%`;
    completed = lastPosition >= lesson.totalSeconds;
  }
  if (!userLesson) {
    //add to database
    const newUserLesson = await UserLesson.create({
      user: req.user._id,
      lesson: lessonId,
      lastPosition: lastPosition,
      progress,
      completed,
    });
    return res.status(201).json({
      status: "success",
      data: newUserLesson,
    });
  } else {
    //update in database
    const newLastPosition = Math.max(userLesson.lastPosition, lastPosition);
    userLesson.lastPosition = newLastPosition;
    if (!lesson.totalSeconds || lesson.totalSeconds === 0) {
      progress = "0%";
      completed = false;
    } else {
      progress = `${(newLastPosition / lesson.totalSeconds) * 100}%`;
      completed = newLastPosition >= lesson.totalSeconds;
    }
    userLesson.progress = progress;
    userLesson.completed = completed;
    await userLesson.save();
    return res.status(200).json({
      status: "success",
      data: userLesson,
    });
  }
});

const getLessonProgress = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return next({ status: 404, message: "Lesson not found" });
  }
  const userLesson = await UserLesson.findOne({
    user: req.user._id,
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
