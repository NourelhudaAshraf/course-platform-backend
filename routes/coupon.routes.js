const express = require("express");
const {
  getAllCoupons,
  createCoupon,
  getCouponById,
  deleteCoupon,
  updateCouponById,
  validateCoupon,
} = require("../controllers/coupon.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const validate = require("../utils/validate-schema");
const {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
} = require("../validations/coupon.validation");

const router = express.Router();

router.post(
  "/validate",
  protect,
  restrictTo("user"),
  validate(validateCouponSchema),
  validateCoupon,
);

router.use(protect, restrictTo("admin"));
router
  .route("/")
  .get(getAllCoupons)
  .post(validate(createCouponSchema), createCoupon);
router
  .route("/:id")
  .get(getCouponById)
  .patch(validate(updateCouponSchema), updateCouponById)
  .delete(deleteCoupon);

module.exports = router;
