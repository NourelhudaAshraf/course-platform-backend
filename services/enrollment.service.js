const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");
const env = require("../config/env");
const Coupon = require("../models/coupon.model");
const { checkIfValidCoupon } = require("../utils/helpers");
const CouponUsage = require("../models/coupon-usage.model");

const toCents = (price) => Math.round(price * 100);

const getCheckoutSessionService = async (
  courseId,
  user,
  stripe,
  couponCode,
) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error("Course not found");
    error.status = 404;
    throw error;
  }
  const enroll = await Enrollment.findOne({ course: courseId, user: user._id });
  if (enroll) {
    const error = new Error("You are already enrolled in this course");
    error.status = 400;
    throw error;
  }
  let finalPrice = course.price;
  let discountAmount = 0;
  let coupon = null;

  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
    });

    if (!checkIfValidCoupon(coupon)) {
      const error = new Error("Invalid coupon");
      error.status = 400;
      throw error;
    }
    // Has this user already used this coupon?
    const previousUsage = await CouponUsage.findOne({
      coupon: coupon._id,
      user: user._id,
    });

    if (previousUsage) {
      const error = new Error("You have already used this coupon");
      error.status = 400;
      throw error;
    }

    // Calculate discount
    discountAmount = course.price * (coupon.percentage / 100);
    finalPrice = course.price - discountAmount;
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${env.FRONTEND_URL}/courses/${courseId}`,
    cancel_url: `${env.FRONTEND_URL}/courses/${courseId}`,
    customer_email: user.email,
    client_reference_id: courseId,
    metadata: {
      courseId: course._id.toString(),
      userId: user._id.toString(),
      ...(coupon && {
        couponId: coupon._id.toString(),
      }),
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${course.title} course`,
            description: course.description,
            ...(course.image && { images: [course.image] }),
          },
          unit_amount: toCents(finalPrice),
        },
        quantity: 1,
      },
    ],
  });

  return session.url;
};

const webhookHandlerService = async (event) => {
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const course = await Course.findById(session.metadata.courseId);
      if (!course) {
        const error = new Error("Course not found");
        error.status = 404;
        throw error;
      }

      let expectedPrice = course.price;
      let coupon = null;

      // If coupon was used
      if (session.metadata.couponId) {
        coupon = await Coupon.findById(session.metadata.couponId);

        if (!coupon) {
          const error = new Error("Coupon not found");
          error.status = 404;
          throw error;
        }

        const discount = course.price * (coupon.percentage / 100);

        expectedPrice = course.price - discount;
      }

      // Verify Stripe amount
      if (toCents(expectedPrice) !== session.amount_total) {
        const error = new Error("Price mismatch");
        error.status = 400;
        throw error;
      }

      await Enrollment.findOneAndUpdate(
        {
          stripeSessionId: session.id,
        },
        {
          course: session.metadata.courseId,
          user: session.metadata.userId,
          price: expectedPrice,
          paymentStatus: "paid",
          stripeSessionId: session.id,
        },
        {
          upsert: true,
          new: true,
        },
      );

      // Record coupon usage
      if (coupon) {
        await CouponUsage.create({
          coupon: coupon._id,
          user: session.metadata.userId,
          course: session.metadata.courseId,
          discountAmount: course.price - expectedPrice,
        });

        await Coupon.findByIdAndUpdate(coupon._id, {
          $inc: {
            usedCount: 1,
          },
        });
      }
    }

    return true;
  } catch (err) {
    console.error("Enrollment processing failed", err);

    const error = new Error("Enrollment processing failed");

    error.status = 500;

    throw error;
  }
};

const checkIfCourseEnrolledService = async (user, course) => {
  const enroll = await Enrollment.findOne({ user, course });
  return !!enroll;
};

module.exports = {
  getCheckoutSessionService,
  webhookHandlerService,
  checkIfCourseEnrolledService,
};
