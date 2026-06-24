const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");
const User = require("../models/user.model");

const getStatisticsService = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [userStats, totalCourses, enrollmentStats] = await Promise.all([
    User.aggregate([
      { $match: { role: "user" } },
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          newUsersThisMonth: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $count: "count" },
          ],
        },
      },
    ]),
    Course.countDocuments(),
    Enrollment.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        // $facet is used to apply multiple aggregations to the same pipeline
        $facet: {
          totalEnrollments: [{ $count: "count" }],
          newEnrollmentsThisMonth: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $count: "count" },
          ],
          totalRevenue: [
            { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
          ],
          thisMonthRevenue: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
          ],
          lastMonthRevenue: [
            {
              $match: {
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
              },
            },
            { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
          ],
        },
      },
    ]),
  ]);

  const users = userStats[0] ?? {};
  const enrollments = enrollmentStats[0] ?? {};

  const totalUsers = users.totalUsers[0]?.count ?? 0;
  const newUsersThisMonth = users.newUsersThisMonth[0]?.count ?? 0;
  const totalEnrollments = enrollments.totalEnrollments[0]?.count ?? 0;
  const newEnrollmentsThisMonth =
    enrollments.newEnrollmentsThisMonth[0]?.count ?? 0;
  const totalRevenue = enrollments.totalRevenue[0]?.totalRevenue ?? 0;
  const current = enrollments.thisMonthRevenue[0]?.totalRevenue ?? 0;
  const previous = enrollments.lastMonthRevenue[0]?.totalRevenue ?? 0;

  let revenueChange = 0;
  if (previous > 0) {
    revenueChange = ((current - previous) / previous) * 100;
  }

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalRevenue,
    newUsersThisMonth,
    newEnrollmentsThisMonth,
    revenueChange,
  };
};

module.exports = {
  getStatisticsService,
};
