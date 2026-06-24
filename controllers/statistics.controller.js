const catchAsync = require("../utils/catch-async");
const { getStatisticsService } = require("../services/statistics.service");

const getStatistics = catchAsync(async (req, res, next) => {
  const statistics = await getStatisticsService();
  res.status(200).json({
    status: "success",
    data: statistics,
  });
});

module.exports = { getStatistics };
