const express = require("express");
const { uploadVideo: videoUpload } = require("../config/multer");
const { uploadLimiter } = require("../middleware/rate-limit.middleware");
const {
  getAllLessons,
  getLessonsWithoutVideo,
  createLesson,
  getLessonById,
  updateLessonById,
  deleteLesson,
} = require("../controllers/lesson.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  createLessonSchema,
  updateLessonSchema,
} = require("../validations/lesson.validation");
const validate = require("../utils/validate-schema");
const { requireEnrollment } = require("../middleware/enrollment.middleware");
const { setCourseId, uploadVideo } = require("../middleware/lesson.middleware");
const router = express.Router({ mergeParams: true });

router.get("/general", getLessonsWithoutVideo);

router
  .route("/")
  .get(protect, requireEnrollment, getAllLessons)
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
    uploadLimiter,
    videoUpload.single("video"),
    validate(updateLessonSchema),
    uploadVideo,
    updateLessonById,
  )
  .delete(protect, restrictTo("admin"), deleteLesson);

module.exports = router;
