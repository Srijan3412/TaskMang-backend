export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "PostgreSQL Prisma Auth Task Manager API",
    version: "1.0.0",
    description: "Production-ready, highly versioned auth API with Express and PostgreSQL",
  },
  servers: [
    {
      url: "http://localhost:4000/api/v1",
      description: "Local Development Server",
    },
  ],
  paths: {},
  components: {},
};

export const swaggerSetup = (app) => {
  // Skeleton configuration mapping.
  // In the future, install swagger-ui-express and bind here:
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("📖 API Documentation placeholder initialized under backend/src/docs/swagger.js");
};
