const { Router } = require("express");

const { getAchievements } = require("../controllers/achievementController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/", requireAuth, getAchievements);

module.exports = router;
