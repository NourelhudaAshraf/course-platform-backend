const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A lesson should have a title!"],
  },
  videoUrl: String,
  totalSeconds: {
    type: Number,
    min: [0, "Video duration cannot be negative"],
  },
  description: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Lesson must belong to a course!"],
  },
  order: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
lessonSchema.index({ course: 1, order: 1 }, { unique: true });

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
