const Coupon = require("../models/coupon.model");
const Course = require("../models/course.model");
const CouponUsage = require("../models/coupon-usage.model");
const { checkIfValidCoupon } = require("../utils/helpers");

const validateCouponService = async ({ code, courseId, userId }) => {
  // 1. Find course
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error("Course not found!");
    error.status = 404;
    throw error;
  }

  // 2. Find coupon
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });
  if (!checkIfValidCoupon(coupon)) {
    const error = new Error("Invalid coupon!");
    error.status = 400;
    throw error;
  }

  // 3. Check user's usage
  const previousUsage = await CouponUsage.findOne({
    coupon: coupon._id,
    user: userId,
  });
  if (previousUsage) {
    const error = new Error("You have already used this coupon!");
    error.status = 400;
    throw error;
  }

  // 4. Calculate discount
  const discountAmount = course.price * (coupon.percentage / 100);
  const finalPrice = course.price - discountAmount;

  return {
    coupon: {
      _id: coupon._id,
      code: coupon.code,
      percentage: coupon.percentage,
    },
    course: {
      _id: course._id,
      title: course.title,
    },
    originalPrice: course.price,
    discountAmount,
    finalPrice,
  };
};

module.exports = { validateCouponService };
