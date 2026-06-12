import prisma from "../database/prisma.js";
import ApiError from "../utils/ApiError.js";

// ─── GET Tasks ────────────────────────────────────────────────────────────────

/**
 * USER  → returns only tasks belonging to that user
 * ADMIN → returns all tasks across all users
 */
export const getTasks = async (userId, role) => {
  const where = role === "ADMIN" ? {} : { userId };

  return await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// ─── GET All Tasks (ADMIN only) ───────────────────────────────────────────────

export const getAllTasks = async () => {
  return await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// ─── GET Task By ID ───────────────────────────────────────────────────────────

/**
 * Returns a task by ID.
 * USER can only access their own task.
 * ADMIN can access any task.
 */
export const getTaskById = async (userId, taskId, role) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (role !== "ADMIN" && task.userId !== userId) {
    throw new ApiError(403, "Forbidden: You do not have access to this task");
  }

  return task;
};

// ─── CREATE Task ──────────────────────────────────────────────────────────────

export const createTask = async (userId, taskData) => {
  const { title, description, status } = taskData;

  return await prisma.task.create({
    data: {
      title,
      description: description || null,
      status: status || "PENDING",
      userId,
    },
  });
};

// ─── UPDATE Task ──────────────────────────────────────────────────────────────

/**
 * USER can only update their own task.
 * ADMIN can update any task.
 */
export const updateTask = async (userId, taskId, taskData, role) => {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });

  if (!existing) {
    throw new ApiError(404, "Task not found");
  }

  if (role !== "ADMIN" && existing.userId !== userId) {
    throw new ApiError(403, "Forbidden: You do not have permission to update this task");
  }

  const { title, description, status } = taskData;

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
    },
  });
};

// ─── DELETE Task ──────────────────────────────────────────────────────────────

/**
 * USER can only delete their own task.
 * ADMIN can delete any task.
 */
export const deleteTask = async (userId, taskId, role) => {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });

  if (!existing) {
    throw new ApiError(404, "Task not found");
  }

  if (role !== "ADMIN" && existing.userId !== userId) {
    throw new ApiError(403, "Forbidden: You do not have permission to delete this task");
  }

  await prisma.task.delete({ where: { id: taskId } });
  return true;
};
