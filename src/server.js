// Import env configuration first to trigger Zod validation checks on start
import env from "./config/env.js";
import app from "./app.js";
import prisma from "./database/prisma.js";

const startServer = async () => {
  try {
    // Check Database Connectivity
    await prisma.$connect();
    console.log("🐘 PostgreSQL Database connection established via Prisma successfully.");
  } catch (error) {
    console.warn("⚠️  PostgreSQL Database connection failed. Running in mock/offline mode.");
    console.warn(`   Error details: ${error.message}`);
  }

  try {
    app.listen(env.PORT, () => {
      console.log(`🚀 Server initialized and listening on PORT: ${env.PORT}`);
      console.log(`   Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to initialize Express Server processes:");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
