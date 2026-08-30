const mongoose = require("mongoose");

const couponUsageSchema = new mongoose.Schema(
  {
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

//this insures user uses coupon once
couponUsageSchema.index({ coupon: 1, user: 1 }, { unique: true });

const CouponUsage = mongoose.model("CouponUsage", couponUsageSchema);
module.exports = CouponUsage;
