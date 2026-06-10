const express = require("express");
const multer = require("multer");
const {
  getAllLessons,
  createLesson,
  getLessonById,
  updateLessonById,
  deleteLesson,
  setCourseId,
  uploadVideo,
} = require("../controllers/Lessons");
const { protect, restrictTo } = require("../controllers/Auth");
const { getLessonProgress } = require("../controllers/UserLessons");
const {
  createLessonSchema,
  updateLessonSchema,
} = require("../validations/Lessons");
const validate = require("../utils/validateSchema");
//multer to handle multipart/form-data requests
//memoryStorage() -> store the file in memory (ram) so not storing file locally
//diskStorage() -> store the file locally in disk
const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router({ mergeParams: true });

router.route("/").get(getAllLessons).post(
  protect,
  restrictTo("admin"),
  upload.single("video"), // file field name "video" -> req.file -> req.body after this runs
  validate(createLessonSchema),
  setCourseId,
  uploadVideo,
  createLesson,
);

router
  .route("/:id")
  .get(getLessonById)
  .patch(
    protect,
    restrictTo("admin"),
    validate(updateLessonSchema),
    updateLessonById,
  )
  .delete(protect, restrictTo("admin"), deleteLesson);

router.get("/:lessonId/progress", protect, getLessonProgress);

module.exports = router;
