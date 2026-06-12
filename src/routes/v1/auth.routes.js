import { Router } from "express";
import * as authController from "../../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../../validators/auth.validator.js";

const router = Router();

// POST /api/v1/auth/register
// Public — validate body, then register
router.post("/register", validateRegister, authController.register);

// POST /api/v1/auth/login
// Public — validate body, then login
router.post("/login", validateLogin, authController.login);

export default router;
