const express = require("express");
const {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourseById,
  deleteCourse,
  setUserId,
} = require("../controllers/Courses");
const { protect, restrictTo } = require("../controllers/Auth");
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
    validate(createCourseSchema),
    setUserId,
    createCourse,
  );

router
  .route("/:id")
  .get(getCourseById)
  .patch(
    protect,
    restrictTo("admin"),
    validate(updateCourseSchema),
    updateCourseById,
  )
  .delete(protect, restrictTo("admin"), deleteCourse);

router.use("/:courseId/lessons", lessonRouter);

module.exports = router;
