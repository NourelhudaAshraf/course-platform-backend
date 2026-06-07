const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A course should have a title!"],
  },
  description: {
    type: String,
    required: [true, "A course should have a description!"],
    minlength: 8,
  },
  price: Number,
  image: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Course must belong to an admin!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

courseSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name",
  });
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
