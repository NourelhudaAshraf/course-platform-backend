const UserLesson = require("../models/user-lesson.model");
const Lesson = require("../models/lesson.model");
const { createCertificateService } = require("./certificate.service");

const isCompleted = (position, totalSeconds) =>
  totalSeconds > 0 && position >= totalSeconds;

const watchLessonService = async (user, lessonId, lastPosition) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    const error = new Error("Lesson not found");
    error.status = 404;
    throw error;
  }
  let userLesson = await UserLesson.findOne({
    user: user._id,
    lesson: lessonId,
  });

  if (userLesson) {
    //update in database
    const newLastPosition = Math.max(userLesson.lastPosition, lastPosition);
    userLesson.lastPosition = newLastPosition;
    userLesson.completed = isCompleted(newLastPosition, lesson.totalSeconds);
    userLesson = await userLesson.save();
  } else {
    //add to database
    userLesson = await UserLesson.create(
      {
        user: user._id,
        lesson: lessonId,
        lastPosition: lastPosition,
        completed: isCompleted(lastPosition, lesson.totalSeconds),
      },
      { new: true },
    );
  }

  if (userLesson.completed) {
    const { certificateReady } = await getCompletedLessonsService(
      user,
      lesson.course,
    );
    if (certificateReady) {
      console.log("Creating certificate");
      await createCertificateService({ user, courseId: lesson.course });
    }
  }
  return userLesson;
};

const getCompletedLessonsService = async (user, courseId) => {
  const lessons = await Lesson.find({ course: courseId }).select("_id");
  const lessonIds = lessons.map((l) => l._id);
  const userLessons = await UserLesson.find({
    user: user._id,
    lesson: { $in: lessonIds },
  }).select("lesson completed lastPosition");
  const completedLessons = userLessons.filter(
    (userLesson) => userLesson.completed,
  ).length;

  const totalLessons = lessons.length;

  const certificateReady =
    totalLessons > 0 && completedLessons === totalLessons;

  return {
    userLessons,
    certificateReady,
  };
};

module.exports = {
  watchLessonService,
  getCompletedLessonsService,
};
