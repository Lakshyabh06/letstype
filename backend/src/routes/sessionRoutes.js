const { Router } = require("express");

const {
  getSessions,
  postSession
} = require("../controllers/sessionController");
const { requireAuth } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");
const { createSessionSchema } = require("../validators/sessionValidator");

const router = Router();

router.get("/", requireAuth, getSessions);
router.post(
  "/",
  requireAuth,
  validateRequest(createSessionSchema),
  postSession
);

module.exports = router;
