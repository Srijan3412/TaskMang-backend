import { PrismaClient } from "@prisma/client";
import env from "../config/env.js";

// Instantiate a single PrismaClient and log queries depending on the environment
const prisma = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
});

export default prisma;
