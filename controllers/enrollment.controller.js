const env = require("../config/env");
const Stripe = require("stripe");
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const Enrollment = require("../models/enrollment.model");
const catchAsync = require("../utils/catch-async");
const { getAllDocs } = require("../utils/handle-factory");
const {
  getCheckoutSessionService,
  webhookHandlerService,
  checkIfCourseEnrolledService,
} = require("../services/enrollment.service");
const { coursePop } = require("../utils/constants");

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const url = await getCheckoutSessionService(
    req.params.courseId,
    req.user,
    stripe,
  );
  res.status(200).json({
    status: "success",
    data: {
      url,
    },
  });
});

// for deployment (needs our backend to be deployed)
const webhookHandler = catchAsync(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return next({ status: 400, message: `Webhook Error: ${err.message}` });
  }
  await webhookHandlerService(event);
  res.status(200).json({ status: "success", received: true });
});

const checkIfCourseEnrolled = catchAsync(async (req, res, next) => {
  const enrolled = await checkIfCourseEnrolledService(
    req.user,
    req.params.courseId,
  );
  res.status(200).json({ status: "success", data: enrolled });
});

const getEnrolledCourses = getAllDocs(Enrollment, true, coursePop);

const getAllPayments = getAllDocs(Enrollment, false, [
  { path: "user", select: "name" },
  coursePop,
]);

module.exports = {
  getCheckoutSession,
  webhookHandler,
  checkIfCourseEnrolled,
  getEnrolledCourses,
  getAllPayments,
};
