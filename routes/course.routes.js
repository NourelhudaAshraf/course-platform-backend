const express = require("express");
const { uploadImage: imageUpload } = require("../config/multer");
const { uploadLimiter } = require("../middleware/rate-limit.middleware");
const {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourseById,
  deleteCourse,
} = require("../controllers/course.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const lessonRouter = require("./lesson.routes");
const {
  setUserId,
  authorizedToEditCourse,
  uploadImage,
} = require("../middleware/course.middleware");
const {
  createCourseSchema,
  updateCourseSchema,
} = require("../validations/course.validation");
const {
  courseIdParamSchema,
  idParamSchema,
} = require("../validations/param.validation");
const { listCoursesQuerySchema } = require("../validations/query.validation");
const validate = require("../utils/validate-schema");
const { validateParams, validateQuery } = validate;
const router = express.Router();

router
  .route("/")
  .get(validateQuery(listCoursesQuerySchema), getAllCourses)
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
  .get(validateParams(idParamSchema), getCourseById)
  .patch(
    validateParams(idParamSchema),
    protect,
    restrictTo("admin"),
    authorizedToEditCourse,
    uploadLimiter,
    imageUpload.single("image"),
    validate(updateCourseSchema),
    uploadImage,
    updateCourseById,
  )
  .delete(
    validateParams(idParamSchema),
    protect,
    restrictTo("admin"),
    authorizedToEditCourse,
    deleteCourse,
  );

router.use(
  "/:courseId/lessons",
  validateParams(courseIdParamSchema),
  lessonRouter,
);

module.exports = router;
