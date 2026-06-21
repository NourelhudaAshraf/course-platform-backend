const express = require("express");
// const { check } = require("express-validator");
const {
  signup,
  login,
  getMe,
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
  resetPasswordSchema,
  updatePasswordSchema,
} = require("../validations/auth.validation");
const validate = require("../utils/validate-schema");
const { protect } = require("../middleware/auth.middleware");
const { forgotPasswordLimiter } = require("../middleware/rate-limit.middleware");
const router = express.Router();

router.post(
  "/signup",
  // check("email").isEmail().withMessage("Invalid email"),
  validate(signupSchema),
  signup,
);
router.post("/login", validate(loginSchema), login);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword,
);
router.patch(
  "/update-password",
  protect,
  validate(updatePasswordSchema),
  updatePassword,
);
router.get("/me", protect, getMe, getUserById);
router.post("/logout", protect, logout);

module.exports = router;
