const express = require("express");

const router = express.Router();

const { protect, restrictTo } = require("../middleware/auth.middleware");
const {
  getCheckoutSession,
  checkIfCourseEnrolled,
  getEnrolledCourses,
  getAllPayments,
} = require("../controllers/enrollment.controller");
const { courseIdParamSchema } = require("../validations/param.validation");
const {
  listEnrollmentsQuerySchema,
} = require("../validations/query.validation");
const validate = require("../utils/validate-schema");
const { validateParams, validateQuery } = validate;

router.use(protect);

/**
 * @swagger
 * /enrollment/checkout-session/{courseId}:
 *   get:
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CourseIdParam'
 *     responses:
 *       200:
 *         description: Checkout session created successfully
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
  .route("/checkout-session/:courseId")
  .get(
    validateParams(courseIdParamSchema),
    restrictTo("user"),
    getCheckoutSession,
  );

/**
 * @swagger
 * /enrollment/my-courses:
 *   get:
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrolled courses retrieved successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  "/my-courses",
  restrictTo("user"),
  validateQuery(listEnrollmentsQuerySchema),
  getEnrolledCourses,
);

/**
 * @swagger
 * /enrollment/{courseId}:
 *   get:
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CourseIdParam'
 *     responses:
 *       200:
 *         description: Course enrolled successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get(
  "/:courseId",
  validateParams(courseIdParamSchema),
  checkIfCourseEnrolled,
);

router.use(restrictTo("admin"));

/**
 * @swagger
 * /enrollment:
 *   get:
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All payments retrieved successfully
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
  .get(validateQuery(listEnrollmentsQuerySchema), getAllPayments);

module.exports = router;
