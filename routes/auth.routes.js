const express = require("express");
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth.controller");
const { getUserById } = require("../controllers/user.controller");
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordTokenParamSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} = require("../validations/auth.validation");
const validate = require("../utils/validate-schema");
const { validateParams } = validate;
const { protect, getMe } = require("../middleware/auth.middleware");
const {
  forgotPasswordLimiter,
} = require("../middleware/rate-limit.middleware");
const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Signup'
 *     responses:
 *       201:
 *         description: Signup successful
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post("/signup", validate(signupSchema), signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  forgotPassword,
);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   post:
 *     tags: [Authentication]
 *     parameters:
 *       - $ref: '#/components/parameters/ResetTokenParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/reset-password/:token",
  validateParams(resetPasswordTokenParamSchema),
  validate(resetPasswordSchema),
  resetPassword,
);

/**
 * @swagger
 * /auth/update-password:
 *   patch:
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassword'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch(
  "/update-password",
  protect,
  validate(updatePasswordSchema),
  updatePassword,
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/me", protect, getMe, getUserById);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/logout", protect, logout);

module.exports = router;
