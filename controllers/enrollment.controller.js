const env = require("../config/env");
const Stripe = require("stripe");
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const Enrollment = require("../models/enrollment.model");
const UserLesson = require("../models/user-lesson.model");
const Lesson = require("../models/lesson.model");
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

const getEnrolledCourses = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 25);
  const skip = (page - 1) * limit;
  const totalItems = await Enrollment.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  const pipeline = [
    // 1. match user's enrollments
    {
      $match: {
        user: userId,
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    // 3. Convert course array → object as lookup return as array
    {
      $unwind: "$course",
    },
    // 4. Get all lessons belonging to this course
    {
      $lookup: {
        from: "lessons",
        //let -> creates a variable inside the $lookup.
        let: { courseId: "$course._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                // Lesson.course === Enrollment.course
                $eq: ["$course", "$$courseId"],
              },
            },
          },
          {
            //I only need its ID.
            $project: {
              _id: 1,
            },
          },
        ],
        as: "lessons",
      },
    },
    // 5. Get lessons watched by user
    {
      $lookup: {
        from: "userlessons",
        let: {
          lessonIds: "$lessons._id",
        },
        pipeline: [
          {
            $match: {
              user: userId,
              completed: true,
              $expr: {
                $in: ["$lesson", "$$lessonIds"],
              },
            },
          },
        ],
        as: "completedLessons",
      },
    },
    // 6. add progress object
    {
      $addFields: {
        progress: {
          totalLessons: {
            $size: "$lessons",
          },
          completedLessons: {
            $size: "$completedLessons",
          },
          percentage: {
            $cond: [
              { $eq: [{ $size: "$lessons" }, 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $size: "$completedLessons" },
                          { $size: "$lessons" },
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
    },
    // 7. Remove temporary arrays
    {
      $project: {
        lessons: 0,
        completedLessons: 0,
      },
    },
    // 8. Pagination
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];
  const docs = await Enrollment.aggregate(pipeline);
  res.status(200).json({
    status: "success",
    results: docs.length,
    totalPages,
    page,
    data: docs,
  });
});

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
