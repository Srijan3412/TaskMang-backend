import { Router } from "express";
import * as taskController from "../../controllers/task.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import roleMiddleware from "../../middleware/role.middleware.js";
import { validateCreateTask, validateUpdateTask } from "../../validators/auth.validator.js";

const router = Router();

// All task routes require authentication
router.use(authMiddleware);

// GET  /api/v1/tasks
//   USER  → returns only their own tasks
//   ADMIN → returns ALL tasks across all users
router.get("/", taskController.getAllTasks);

// POST /api/v1/tasks — USER and ADMIN can create tasks
router.post("/", validateCreateTask, taskController.createTask);

// GET    /api/v1/tasks/:id — owner or ADMIN
router.get("/:id", taskController.getTaskById);

// PUT    /api/v1/tasks/:id — owner or ADMIN
router.put("/:id", validateUpdateTask, taskController.updateTask);

// DELETE /api/v1/tasks/:id — owner or ADMIN
router.delete("/:id", taskController.deleteTask);

// ADMIN-only: GET /api/v1/tasks/admin/all — explicit admin endpoint for all tasks
router.get("/admin/all", roleMiddleware("ADMIN"), taskController.getAllTasksAdmin);

export default router;
