const { getCertificateService } = require("../services/certificate.service");
const catchAsync = require("../utils/catch-async");

const getCertificate = catchAsync(async (req, res, next) => {
  const certificate = await getCertificateService({
    user: req.user,
    course: req.params.courseId,
  });
  res.status(200).json({
    status: "success",
    data: certificate,
  });
});

module.exports = {
  getCertificate,
};
