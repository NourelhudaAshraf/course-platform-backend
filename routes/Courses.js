const express = require("express");
const multer = require("multer");
const {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourseById,
  deleteCourse,
  setUserId,
  uploadImage,
} = require("../controllers/Courses");
const { protect, restrictTo } = require("../controllers/Auth");
const lessonRouter = require("./Lessons");

const upload = multer({
  storage: multer.memoryStorage(),
});

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
    upload.single("image"),
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
    upload.single("image"),
    validate(updateCourseSchema),
    uploadImage,
    updateCourseById,
  )
  .delete(protect, restrictTo("admin"), deleteCourse);

router.use("/:courseId/lessons", lessonRouter);

module.exports = router;
