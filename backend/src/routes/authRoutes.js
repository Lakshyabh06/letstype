const { Router } = require("express");

const {
  getMe,
  googleLogin,
  login,
  register
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");
const {
  googleLoginSchema,
  loginSchema,
  registerSchema
} = require("../validators/authValidator");

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/google", validateRequest(googleLoginSchema), googleLogin);
router.get("/me", requireAuth, getMe);

module.exports = router;
