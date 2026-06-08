const express = require("express");

const router = express.Router();

const { protect, restrictTo } = require("../controllers/Auth");
const {
  getCheckoutSession,
  createEnrollment,
  checkIfCourseEnrolled,
  getEnrolledCourses,
  getAllPayments,
} = require("../controllers/Enrollments");

router.get("/success", createEnrollment);

router.use(protect);
router
  .route("/checkout-session/:courseId")
  .get(restrictTo("user"), getCheckoutSession);
router.get("/my-courses", restrictTo("user"), getEnrolledCourses);
router.get("/:courseId", checkIfCourseEnrolled);

router.use(restrictTo("admin"));
router.route("/").get(getAllPayments);

module.exports = router;
