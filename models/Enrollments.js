const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Enrollment must belong to a course!"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Enrollment must belong to an user!"],
  },
  paymentStatus: {
    type: String,
    default: "paid",
    enum: ["paid", "pending"],
  },
  price: {
    type: Number,
    required: [true, "Enrollment must have a price!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

enrollmentSchema.pre(/^find/, function () {
  this.populate({
    path: "user",
    select: "name",
  }).populate({
    path: "course",
    select: "title price description image",
  });
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
