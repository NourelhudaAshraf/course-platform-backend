const express = require("express");
// const { check } = require("express-validator");
const { signup, login, getMe, logout } = require("../controllers/Auth");
const { getUserById } = require("../controllers/Users");
const { signupSchema, loginSchema } = require("../validations/Auth");
const validate = require("../utils/validateSchema");
const { protect } = require("../middleware/Auth");
const router = express.Router();

router.post(
  "/signup",
  // check("email").isEmail().withMessage("Invalid email"),
  validate(signupSchema),
  signup,
);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe, getUserById);
router.get("/logout", logout);

module.exports = router;
