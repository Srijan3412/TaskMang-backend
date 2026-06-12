import { body, validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

// ─── Reusable result checker ──────────────────────────────────────────────────

/**
 * Reads express-validator's result and throws ApiError if any errors exist.
 * Drop this as the last middleware in any validation chain.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => `${e.path}: ${e.msg}`);
    return next(new ApiError(400, "Validation Error", messages));
  }
  next();
};

// ─── Auth Validation Chains ───────────────────────────────────────────────────

export const validateRegister = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),

  handleValidationErrors,
];

export const validateLogin = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// ─── Task Validation Chains ───────────────────────────────────────────────────

export const validateCreateTask = [
  body("title")
    .notEmpty().withMessage("Task title is required")
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage("Title must be between 1 and 255 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Description must not exceed 1000 characters"),

  body("status")
    .optional()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .withMessage("Status must be one of: PENDING, IN_PROGRESS, COMPLETED"),

  handleValidationErrors,
];

export const validateUpdateTask = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage("Title must be between 1 and 255 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Description must not exceed 1000 characters"),

  body("status")
    .optional()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .withMessage("Status must be one of: PENDING, IN_PROGRESS, COMPLETED"),

  handleValidationErrors,
];
