const { Router } = require("express");

const {
  getAnalytics,
  getAnalyticsTrends
} = require("../controllers/analyticsController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/", requireAuth, getAnalytics);
router.get("/trends", requireAuth, getAnalyticsTrends);

module.exports = router;
