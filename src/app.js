import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/v1/auth.routes.js";
import taskRoutes from "./routes/v1/task.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import sanitizeMiddleware from "./middleware/sanitize.middleware.js";
import { globalLimiter } from "./middleware/rateLimiter.middleware.js";
import { swaggerSetup } from "./docs/swagger.js";
import env from "./config/env.js";

const app = express();

// ─── 1. Security Headers (Helmet) ────────────────────────────────────────────
// Removes X-Powered-By, adds X-Frame-Options, X-Content-Type-Options,
// Content-Security-Policy, Strict-Transport-Security, etc.
app.use(helmet());

// ─── 2. CORS — restrict to allowed origins ────────────────────────────────────
const allowedOrigins = env.FRONTEND_URL
  ? env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:8080", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── 3. Global Rate Limiter ───────────────────────────────────────────────────
// 100 requests per 15 minutes per IP
app.use(globalLimiter);

// ─── 4. Request Logging ──────────────────────────────────────────────────────
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── 5. Request Parsing with size limits ──────────────────────────────────────
// Limit body size to 10kb to prevent payload-based DoS attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── 6. XSS Sanitization ────────────────────────────────────────────────────
// Strips all HTML/script tags from user input before reaching controllers
app.use(sanitizeMiddleware);

// ─── 7. API Documentation ───────────────────────────────────────────────────
swaggerSetup(app);

// ─── 8. API Endpoints Version 1 ─────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// ─── 9. Fallback 404 Route Handler ──────────────────────────────────────────
app.use(notFound);

// ─── 10. Global Error Handler ───────────────────────────────────────────────
app.use(errorHandler);

export default app;
