const express = require("express");
const { uploadImage: imageUpload } = require("../config/multer");
const { uploadLimiter } = require("../middleware/rateLimit");
const {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourseById,
  deleteCourse,
  setUserId,
  uploadImage,
  authorizedToEditCourse,
} = require("../controllers/Courses");
const { protect, restrictTo } = require("../middleware/Auth");
const lessonRouter = require("./Lessons");

const {
  createCourseSchema,
  updateCourseSchema,
} = require("../validations/Courses");
const validate = require("../utils/validateSchema");
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
