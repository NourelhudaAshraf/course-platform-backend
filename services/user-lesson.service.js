const UserLesson = require("../models/user-lesson.model");
const Lesson = require("../models/lesson.model");

const isCompleted = (position, totalSeconds) =>
  totalSeconds > 0 && position >= totalSeconds;

const watchLessonService = async (user, lessonId, lastPosition) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    const error = new Error("Lesson not found");
    error.status = 404;
    throw error;
  }
  const userLesson = await UserLesson.findOne({
    user: user._id,
    lesson: lessonId,
  });

  if (userLesson) {
    //update in database
    const newLastPosition = Math.max(userLesson.lastPosition, lastPosition);
    userLesson.lastPosition = newLastPosition;
    userLesson.completed = isCompleted(newLastPosition, lesson.totalSeconds);
    await userLesson.save();
    return userLesson;
  } else {
    //add to database
    const newUserLesson = await UserLesson.create({
      user: user._id,
      lesson: lessonId,
      lastPosition: lastPosition,
      completed: isCompleted(lastPosition, lesson.totalSeconds),
    });
    return newUserLesson;
  }
};

const getCompletedLessonsService = async (user, courseId) => {
  const lessons = await Lesson.find({ course: courseId }).select("_id");
  const lessonIds = lessons.map((l) => l._id);
  const userLessons = await UserLesson.find({
    user: user._id,
    lesson: { $in: lessonIds },
  }).select("lesson completed lastPosition");
  return userLessons;
};

module.exports = {
  watchLessonService,
  getCompletedLessonsService,
};
