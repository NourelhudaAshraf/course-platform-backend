const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");
const env = require("../config/env");

const toCents = (price) => Math.round(price * 100);

const getCheckoutSessionService = async (courseId, user, stripe) => {
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
          unit_amount: toCents(course.price),
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
      if (toCents(course.price) !== session.amount_total) {
        const error = new Error("Price mismatch");
        error.status = 400;
        throw error;
      }
      await Enrollment.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          course: session.metadata.courseId,
          user: session.metadata.userId,
          price: course.price,
          paymentStatus: "paid",
        },
        { upsert: true, new: true },
      );
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
