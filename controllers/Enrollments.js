const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Course = require("../models/Courses");
const Enrollment = require("../models/Enrollments");
const catchAsync = require("../utils/catchAsync");
const { getAllDocs } = require("./handleFactory");

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const id = req.params.courseId;
  const course = await Course.findById(id);

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
    session,
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
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Payment successful!");
    await Enrollment.create({
      course: session.metadata.courseId,
      user: session.metadata.userId,
      price: session.amount_total / 100,
      stripeSessionId: session.id,
    });
  }

  res.status(200).json({ received: true });
};

const createEnrollment = catchAsync(async (req, res, next) => {
  const { userId: user, courseId: course, price } = req.query;
  if (!user && !course && !price) return next();
  await Enrollment.create({ user, course, price });
  res.redirect(
    `${req.protocol}://${process.env.FRONTEND_HOST}/courses/${course}`,
  );
});

const checkIfCourseEnrolled = catchAsync(async (req, res, next) => {
  const { courseId: course } = req.params;
  const enroll = await Enrollment.find({ user: req.user._id, course });
  res.status(200).json({ data: !!enroll.length });
});

const getEnrolledCourses = getAllDocs(Enrollment, true);

const getAllPayments = getAllDocs(Enrollment);

module.exports = {
  getCheckoutSession,
  webhookHandler,
  createEnrollment,
  checkIfCourseEnrolled,
  getEnrolledCourses,
  getAllPayments,
};
