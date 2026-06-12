import * as taskService from "../services/task.service.js";
import ApiResponse from "../utils/ApiResponse.js";

// GET /api/v1/tasks
// USER → own tasks only | ADMIN → all tasks
export const getAllTasks = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const tasks = await taskService.getTasks(userId, role);
    res.status(200).json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/tasks/admin/all — ADMIN only explicit endpoint
export const getAllTasksAdmin = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json(new ApiResponse(200, tasks, "All tasks fetched successfully (admin)"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/tasks
export const createTask = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const newTask = await taskService.createTask(userId, req.body);
    res.status(201).json(new ApiResponse(201, newTask, "Task created successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/tasks/:id
export const getTaskById = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const task = await taskService.getTaskById(userId, req.params.id, role);
    res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/tasks/:id
export const updateTask = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const updated = await taskService.updateTask(userId, req.params.id, req.body, role);
    res.status(200).json(new ApiResponse(200, updated, "Task updated successfully"));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/tasks/:id
export const deleteTask = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    await taskService.deleteTask(userId, req.params.id, role);
    res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
  } catch (error) {
    next(error);
  }
};
