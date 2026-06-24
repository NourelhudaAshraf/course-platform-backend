const mongoose = require("mongoose");

const userLessonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "Lesson is required"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastPosition: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
userLessonSchema.index({ user: 1, lesson: 1 }, { unique: true });
const UserLesson = mongoose.model("UserLesson", userLessonSchema);

module.exports = UserLesson;
