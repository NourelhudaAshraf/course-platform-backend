const express = require("express");
const { protect, restrictTo } = require("../middleware/auth.middleware");
const { getStatistics } = require("../controllers/statistics.controller");

const router = express.Router();

/**
 * @swagger
 * /statistics:
 *   get:
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.route("/").get(protect, restrictTo("admin"), getStatistics);

module.exports = router;
