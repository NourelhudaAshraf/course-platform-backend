const express = require("express");
const { getCertificate } = require("../controllers/certificate.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/:courseId", protect, restrictTo("user"), getCertificate);
// router.get("/:certificateNumber", )

module.exports = router;
