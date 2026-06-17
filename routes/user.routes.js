const express = require("express");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateMe,
  getLatestUsers,
  promoteUserToAdmin,
} = require("../controllers/user.controller");
const {
  watchLesson,
  getCompletedLessons,
} = require("../controllers/user-lesson.controller");
const { watchLessonSchema } = require("../validations/user-lesson.validation");
const { updateUserSchema } = require("../validations/auth.validation");
const validate = require("../utils/validate-schema");
const { requireEnrollment } = require("../middleware/enrollment.middleware");

const router = express.Router();

router.patch("/update-me", protect, validate(updateUserSchema), updateMe);
router.post(
  "/watch-lesson",
  protect,
  validate(watchLessonSchema),
  requireEnrollment,
  watchLesson,
);
router.get("/courses/:courseId/user-lessons", protect, getCompletedLessons);
router.use(protect, restrictTo("admin"));
router.route("/").get(getAllUsers);
router.route("/latest-users").get(getLatestUsers);
router.route("/promote/:id").patch(promoteUserToAdmin);
router.route("/:id").get(getUserById).delete(deleteUser);

module.exports = router;
