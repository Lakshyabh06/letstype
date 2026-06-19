const { Router } = require("express");

const {
  getProgress,
  putProgress
} = require("../controllers/progressController");
const { requireAuth } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");
const { upsertProgressSchema } = require("../validators/progressValidator");

const router = Router();

router.get("/", requireAuth, getProgress);
router.put(
  "/",
  requireAuth,
  validateRequest(upsertProgressSchema),
  putProgress
);

module.exports = router;
