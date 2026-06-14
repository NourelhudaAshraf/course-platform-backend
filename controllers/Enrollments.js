const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Course = require("../models/Courses");
const Enrollment = require("../models/Enrollments");
const catchAsync = require("../utils/catchAsync");
const { getAllDocs } = require("./handleFactory");

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const id = req.params.courseId;
  const course = await Course.findById(id);
  if (!course) {
    return next({ status: 404, message: "Course not found" });
  }
  const enroll = await Enrollment.findOne({ course: id, user: req.user._id });
  if (enroll) {
    return next({
      status: 400,
      message: "You are already enrolled in this course",
    });
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    // success_url: `${req.protocol}://${req.get("host")}/api/v1/enrollment/success/?userId=${req.user.id}&courseId=${course._id}&price=${course.price}`,
    success_url: `${process.env.FRONTEND_URL}/courses/${id}`,
    cancel_url: `${process.env.FRONTEND_URL}/courses/${id}`,
    customer_email: req.user.email,
    client_reference_id: id,
    metadata: {
      courseId: course._id.toString(),
      userId: req.user.id,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${course.title} course`,
            description: course.description,
            images: [course.image],
          },
          unit_amount: course.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    session: {
      url: session.url,
    },
  });
});

// for deployment (needs our backend to be deployed)
const webhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: `Webhook Error: ${err.message}`,
    });
  }
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const course = await Course.findById(session.metadata.courseId);
      if (!course) {
        return res
          .status(404)
          .json({ status: "error", message: "Course not found" });
      }
      if (course.price * 100 !== session.amount_total) {
        return res
          .status(400)
          .json({ status: "error", message: "Price mismatch" });
      }
      // console.log("Payment successful!");
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
    res.status(200).json({ status: "success", received: true });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "Enrollment processing failed" });
  }
};

// const createEnrollment = catchAsync(async (req, res, next) => {
//   const { userId: user, courseId: course, price } = req.query;
//   if (!user && !course && !price) return next();
//   await Enrollment.create({ user, course, price });
//   res.redirect(
//     `${req.protocol}://${process.env.FRONTEND_HOST}/courses/${course}`,
//   );
// });

const checkIfCourseEnrolled = catchAsync(async (req, res, next) => {
  const { courseId: course } = req.params;
  const enroll = await Enrollment.findOne({ user: req.user._id, course });
  res.status(200).json({ status: "success", data: !!enroll });
});

const coursePop = { path: "course", select: "title price description image" };

const getEnrolledCourses = getAllDocs(Enrollment, true, coursePop);

const getAllPayments = getAllDocs(Enrollment, false, [
  { path: "user", select: "name" },
  coursePop,
]);

module.exports = {
  getCheckoutSession,
  webhookHandler,
  // createEnrollment,
  checkIfCourseEnrolled,
  getEnrolledCourses,
  getAllPayments,
};
