const express = require("express");
const { uploadVideo: videoUpload } = require("../config/multer");
const { uploadLimiter } = require("../middleware/rateLimit");
const {
  getAllLessons,
  createLesson,
  getLessonById,
  updateLessonById,
  deleteLesson,
  setCourseId,
  uploadVideo,
} = require("../controllers/Lessons");
const { protect, restrictTo } = require("../middleware/Auth");
const { getLessonProgress } = require("../controllers/UserLessons");
const {
  createLessonSchema,
  updateLessonSchema,
} = require("../validations/Lessons");
const validate = require("../utils/validateSchema");
const { requireEnrollment } = require("../middleware/enrollment");
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
