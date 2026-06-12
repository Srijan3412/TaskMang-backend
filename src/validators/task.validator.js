import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().max(500, "Description is too long").optional(),
    completed: z.boolean().default(false).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long").optional(),
    description: z.string().max(500, "Description is too long").optional(),
    completed: z.boolean().optional(),
  }),
});
