const { Router } = require("express");

const { getProfile, patchProfile } = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");
const { updateProfileSchema } = require("../validators/userValidator");

const router = Router();

router.get("/profile", requireAuth, getProfile);
router.patch(
  "/profile",
  requireAuth,
  validateRequest(updateProfileSchema),
  patchProfile
);

module.exports = router;
