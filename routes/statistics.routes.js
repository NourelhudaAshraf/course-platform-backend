const express = require("express");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { getStatistics } = require("../controllers/statistics.controller");

const router = express.Router();

router.route("/").get(protect, restrictTo("admin"), getStatistics);

module.exports = router;
