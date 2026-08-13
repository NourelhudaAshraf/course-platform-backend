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
  lessonIdParamSchema,
} = require("../validations/lesson.validation");
const { listLessonsQuerySchema } = require("../validations/query.validation");
const validate = require("../utils/validate-schema");
const { requireEnrollment } = require("../middleware/enrollment.middleware");
const {
  setCourseId,
  uploadVideo,
  assertLessonInCourse,
  authorizedToEditLesson,
} = require("../middleware/lesson.middleware");
const { validateParams, validateQuery } = validate;
const router = express.Router({ mergeParams: true });

router.get("/general", getLessonsWithoutVideo);

router
  .route("/")
  .get(
    protect,
    requireEnrollment,
    validateQuery(listLessonsQuerySchema),
    getAllLessons,
  )
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
  .get(
    validateParams(lessonIdParamSchema),
    protect,
    requireEnrollment,
    assertLessonInCourse,
    getLessonById,
  )
  .patch(
    validateParams(lessonIdParamSchema),
    protect,
    restrictTo("admin"),
    assertLessonInCourse,
    authorizedToEditLesson,
    uploadLimiter,
    videoUpload.single("video"),
    validate(updateLessonSchema),
    uploadVideo,
    updateLessonById,
  )
  .delete(
    validateParams(lessonIdParamSchema),
    protect,
    restrictTo("admin"),
    assertLessonInCourse,
    authorizedToEditLesson,
    deleteLesson,
  );

module.exports = router;
