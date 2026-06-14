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
    min: [0.01, "Price must be greater than 0"],
  },
  stripeSessionId: { type: String, unique: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
