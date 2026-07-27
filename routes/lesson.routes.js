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
const { setCourseId, uploadVideo } = require("../middleware/lesson.middleware");
const { validateParams, validateQuery } = validate;
const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /courses/{courseId}/lessons/general:
 *   get:
 *     tags: [Lessons]
 *     parameters:
 *       - $ref: '#/components/parameters/CourseIdParam'
 *     responses:
 *       200:
 *         description: General lessons retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/general", getLessonsWithoutVideo);

/**
 * @swagger
 * /courses/{courseId}/lessons:
 *   get:
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CourseIdParam'
 *     responses:
 *       200:
 *         description: All lessons retrieved successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CourseIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateLesson'
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /courses/{courseId}/lessons/{id}:
 *   get:
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CourseIdParam'
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Lesson retrieved successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   patch:
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLesson'
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   delete:
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Lesson deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router
  .route("/:id")
  .get(
    validateParams(lessonIdParamSchema),
    protect,
    requireEnrollment,
    getLessonById,
  )
  .patch(
    validateParams(lessonIdParamSchema),
    protect,
    restrictTo("admin"),
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
    deleteLesson,
  );

module.exports = router;
