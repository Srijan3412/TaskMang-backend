import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/v1/auth.routes.js";
import taskRoutes from "./routes/v1/task.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import { swaggerSetup } from "./docs/swagger.js";

const app = express();

// 1. Global Security & Loggers Middleware
app.use(helmet());
app.use(cors({ origin: "*" })); // Configure origins list inside production settings
app.use(morgan("dev"));

// 2. Request Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. API Documentation
swaggerSetup(app);

// 4. API Endpoints Version 1 Prefixing
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// 5. Fallback 404 Route Handler
app.use(notFound);

// 6. Global Error Logger and Formatter Handler
app.use(errorHandler);

export default app;
