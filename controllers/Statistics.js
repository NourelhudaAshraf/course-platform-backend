const Course = require("../models/Courses");
const Enrollment = require("../models/Enrollments");
const User = require("../models/Users");
const catchAsync = require("../utils/catchAsync");

const getRevenueOfMonth = async (createdAtFilter) => {
  const res = await Enrollment.aggregate([
    { $match: { paymentStatus: "paid", ...(createdAtFilter ?? {}) } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$price" },
      },
    },
  ]);
  return res;
};

const getDate = (month, date) => {
  return new Date(new Date().getFullYear(), month, date);
};

const getStatistics = catchAsync(async (req, res, next) => {
  //Users
  const totalUsers = await User.find({ role: "user" });
  const startOfMonth = getDate(new Date().getMonth(), 1);
  const newUsersThisMonth = await User.countDocuments({
    role: "user",
    createdAt: { $gte: startOfMonth },
  });

  //Courses
  const totalCourses = await Course.find();

  //Enrollment
  const totalEnrollments = await Enrollment.find({ paymentStatus: "paid" });
  const newEnrollmentsThisMonth = await Enrollment.countDocuments({
    paymentStatus: "paid",
    createdAt: { $gte: startOfMonth },
  });
  const result = await getRevenueOfMonth();
  const totalRevenue = result[0]?.totalRevenue || 0;

  //This Month Revenue
  const thisMonthRevenue = await getRevenueOfMonth({
    createdAt: { $gte: startOfMonth },
  });
  //last Month Revenue
  const startOfLastMonth = getDate(new Date().getMonth() - 1, 1);
  const endOfLastMonth = getDate(new Date().getMonth() - 1, 0);
  const lastMonthRevenue = await getRevenueOfMonth({
    createdAt: {
      $gte: startOfLastMonth,
      $lte: endOfLastMonth,
    },
  });
  const current = thisMonthRevenue[0]?.total || 0;
  const previous = lastMonthRevenue[0]?.total || 0;

  let revenueChange = 0;

  if (previous > 0) {
    revenueChange = ((current - previous) / previous) * 100;
  }

  res.status(200).json({
    status: "success",
    data: {
      totalUsers: totalUsers.length,
      totalCourses: totalCourses.length,
      totalEnrollments: totalEnrollments.length,
      totalRevenue,
      newUsersThisMonth,
      newEnrollmentsThisMonth,
      revenueChange,
    },
  });
});

module.exports = getStatistics;
