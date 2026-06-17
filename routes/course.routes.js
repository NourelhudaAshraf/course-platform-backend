const express = require("express");
const { uploadImage: imageUpload } = require("../config/multer");
const { uploadLimiter } = require("../middleware/rate-limit.middleware");
const {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourseById,
  deleteCourse,
  setUserId,
  uploadImage,
  authorizedToEditCourse,
} = require("../controllers/course.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const lessonRouter = require("./lesson.routes");

const {
  createCourseSchema,
  updateCourseSchema,
} = require("../validations/course.validation");
const validate = require("../utils/validate-schema");
const router = express.Router();

router
  .route("/")
  .get(getAllCourses)
  .post(
    protect,
    restrictTo("admin"),
    uploadLimiter,
    imageUpload.single("image"),
    validate(createCourseSchema),
    setUserId,
    uploadImage,
    createCourse,
  );

router
  .route("/:id")
  .get(getCourseById)
  .patch(
    protect,
    restrictTo("admin"),
    authorizedToEditCourse,
    uploadLimiter,
    imageUpload.single("image"),
    validate(updateCourseSchema),
    uploadImage,
    updateCourseById,
  )
  .delete(protect, restrictTo("admin"), authorizedToEditCourse, deleteCourse);

router.use("/:courseId/lessons", lessonRouter);

module.exports = router;
