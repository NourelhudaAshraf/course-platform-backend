const express = require("express");

const router = express.Router();

const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  getCheckoutSession,
  checkIfCourseEnrolled,
  getEnrolledCourses,
  getAllPayments,
} = require("../controllers/enrollment.controller");
const { courseIdParamSchema } = require("../validations/param.validation");
const {
  listEnrollmentsQuerySchema,
} = require("../validations/query.validation");
const validate = require("../utils/validate-schema");
const { validateParams, validateQuery } = validate;

router.use(protect);

router
  .route("/checkout-session/:courseId")
  .get(
    validateParams(courseIdParamSchema),
    restrictTo("user"),
    getCheckoutSession,
  );

router.get(
  "/my-courses",
  restrictTo("user"),
  validateQuery(listEnrollmentsQuerySchema),
  getEnrolledCourses,
);

router.get(
  "/:courseId",
  validateParams(courseIdParamSchema),
  checkIfCourseEnrolled,
);

router.use(restrictTo("admin"));

router
  .route("/")
  .get(validateQuery(listEnrollmentsQuerySchema), getAllPayments);

module.exports = router;
