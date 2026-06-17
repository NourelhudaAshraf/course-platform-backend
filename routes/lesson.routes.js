const express = require("express");
const { uploadVideo: videoUpload } = require("../config/multer");
const { uploadLimiter } = require("../middleware/rate-limit.middleware");
const {
  getAllLessons,
  createLesson,
  getLessonById,
  updateLessonById,
  deleteLesson,
  setCourseId,
  uploadVideo,
} = require("../controllers/lesson.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { getLessonProgress } = require("../controllers/user-lesson.controller");
const {
  createLessonSchema,
  updateLessonSchema,
} = require("../validations/lesson.validation");
const validate = require("../utils/validate-schema");
const { requireEnrollment } = require("../middleware/enrollment.middleware");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllLessons)
  .post(
    protect,
    restrictTo("admin"),
    uploadLimiter,
    videoUpload.single("video"),
    validate(createLessonSchema),
    setCourseId,
    uploadVideo,
    createLesson,
  );

router
  .route("/:id")
  .get(protect, requireEnrollment, getLessonById)
  .patch(
    protect,
    restrictTo("admin"),
    validate(updateLessonSchema),
    updateLessonById,
  )
  .delete(protect, restrictTo("admin"), deleteLesson);

router.get(
  "/:lessonId/progress",
  protect,
  restrictTo("user"),
  requireEnrollment,
  getLessonProgress,
);

module.exports = router;
