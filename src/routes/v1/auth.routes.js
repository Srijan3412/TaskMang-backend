import { Router } from "express";
import * as authController from "../../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../../validators/auth.validator.js";
import { authLimiter } from "../../middleware/rateLimiter.middleware.js";

const router = Router();

// POST /api/v1/auth/register
// Public — rate limited (5/15min), validate body, then register
router.post("/register", authLimiter, validateRegister, authController.register);

// POST /api/v1/auth/login
// Public — rate limited (5/15min), validate body, then login
router.post("/login", authLimiter, validateLogin, authController.login);

export default router;
