const { Router } = require("express");

const {
  getSettings,
  patchSettings
} = require("../controllers/settingsController");
const { requireAuth } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");
const { updateSettingsSchema } = require("../validators/settingsValidator");

const router = Router();

router.get("/", requireAuth, getSettings);
router.patch(
  "/",
  requireAuth,
  validateRequest(updateSettingsSchema),
  patchSettings
);

module.exports = router;
