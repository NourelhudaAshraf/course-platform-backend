const express = require("express");
const { protect, restrictTo } = require("../middleware/Auth");
const getStatistics = require("../controllers/Statistics");

const router = express.Router();

router.route("/").get(protect, restrictTo("admin"), getStatistics);

module.exports = router;
