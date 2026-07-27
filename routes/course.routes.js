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

/**
 * @swagger
 * /courses:
 *   get:
 *     tags: [Courses]
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortQuery'
 *       - $ref: '#/components/parameters/TitleQuery'
 *       - $ref: '#/components/parameters/MinPriceQuery'
 *       - $ref: '#/components/parameters/MaxPriceQuery'
 *     responses:
 *       200:
 *         description: List of courses
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourse'
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /courses/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/IdParam'
 *   get:
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Course details
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   patch:
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCourse'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   delete:
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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
