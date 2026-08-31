const express = require("express");
const { uploadImage: imageUpload } = require("../config/multer");
const { uploadLimiter } = require("../middleware/rate-limit.middleware");
const {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourseById,
  deleteCourse,
  getPublishedCourses,
  getCourseByIdPublish,
} = require("../controllers/course.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const lessonRouter = require("./lesson.routes");
const {
  setUserId,
  authorizedToEditCourse,
  uploadImage,
  publishCourse,
  unPublishCourse,
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

router.get("/publish", getPublishedCourses);
router
  .route("/publish/:id")
  .get(getCourseByIdPublish)
  .patch(protect, restrictTo("admin"), publishCourse, updateCourseById);
router.patch(
  "/un-publish/:id",
  protect,
  restrictTo("admin"),
  unPublishCourse,
  updateCourseById,
);

router.use(
  "/:courseId/lessons",
  validateParams(courseIdParamSchema),
  lessonRouter,
);

router.use(protect, restrictTo("admin"));
router
  .route("/")
  .get(validateQuery(listCoursesQuerySchema), getAllCourses)
  .post(
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
    authorizedToEditCourse,
    uploadLimiter,
    imageUpload.single("image"),
    validate(updateCourseSchema),
    uploadImage,
    updateCourseById,
  )
  .delete(validateParams(idParamSchema), authorizedToEditCourse, deleteCourse);

module.exports = router;
