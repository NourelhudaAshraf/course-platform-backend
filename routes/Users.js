const express = require("express");
const { protect, restrictTo } = require("../middleware/Auth");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateMe,
  getLatestUsers,
  promoteUserToAdmin,
} = require("../controllers/Users");
const {
  watchLesson,
  getCompletedLessons,
} = require("../controllers/UserLessons");
const { watchLessonSchema } = require("../validations/UserLessons");
const { updateUserSchema } = require("../validations/Auth");
const validate = require("../utils/validateSchema");
const { requireEnrollment } = require("../middleware/enrollment");

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
