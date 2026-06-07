const express = require("express");
const {
  signup,
  login,
  getMe,
  protect,
  logout,
} = require("../controllers/Auth");
const { getUserById } = require("../controllers/Users");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe, getUserById);
router.get("/logout", logout);

module.exports = router;
