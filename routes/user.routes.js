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
const { listUsersQuerySchema } = require("../validations/query.validation");
const validate = require("../utils/validate-schema");
const { requireEnrollment } = require("../middleware/enrollment.middleware");
const {
  courseIdParamSchema,
  idParamSchema,
} = require("../validations/param.validation");
const { validateParams, validateQuery } = validate;
const router = express.Router();

router.patch("/update-me", protect, validate(updateUserSchema), updateMe);

router.post(
  "/watch-lesson",
  protect,
  validate(watchLessonSchema),
  requireEnrollment,
  watchLesson,
);

router.get(
  "/courses/:courseId/user-lessons",
  validateParams(courseIdParamSchema),
  protect,
  requireEnrollment,
  getCompletedLessons,
);
router.use(protect, restrictTo("admin"));

router.route("/").get(validateQuery(listUsersQuerySchema), getAllUsers);

router.route("/latest-users").get(getLatestUsers);

router
  .route("/promote/:id")
  .patch(validateParams(idParamSchema), promoteUserToAdmin);

router
  .route("/:id")
  .get(validateParams(idParamSchema), getUserById)
  .delete(validateParams(idParamSchema), deleteUser);

module.exports = router;
