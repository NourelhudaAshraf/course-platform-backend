const Coupon = require("../models/coupon.model");
const {
  getAllDocs,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require("../utils/handle-factory");
const { validateCouponService } = require("../services/coupon.service");
const catchAsync = require("../utils/catch-async");

const getAllCoupons = getAllDocs(Coupon, null);
const getCouponById = getOne(Coupon);
const createCoupon = createOne(Coupon);
const updateCouponById = updateOne(Coupon);
const deleteCoupon = deleteOne(Coupon);

const validateCoupon = catchAsync(async (req, res) => {
  const result = await validateCouponService({
    code: req.body.code,
    courseId: req.body.courseId,
    userId: req.user._id,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCouponById,
  deleteCoupon,
  validateCoupon,
};
