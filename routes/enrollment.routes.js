const express = require("express");

const router = express.Router();

const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  getCheckoutSession,
  checkIfCourseEnrolled,
  getEnrolledCourses,
  getAllPayments,
} = require("../controllers/enrollment.controller");

router.use(protect);
router
  .route("/checkout-session/:courseId")
  .get(restrictTo("user"), getCheckoutSession);
router.get("/my-courses", restrictTo("user"), getEnrolledCourses);
router.get("/:courseId", checkIfCourseEnrolled);

router.use(restrictTo("admin"));
router.route("/").get(getAllPayments);

module.exports = router;
