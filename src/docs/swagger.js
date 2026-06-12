import swaggerUi from "swagger-ui-express";

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Taskly — Task Management REST API",
    version: "1.0.0",
    description: "Production-ready REST API with JWT Auth, Role-Based Access Control, Input Validation, and Security Headers.",
    contact: {
      name: "API Support",
      email: "support@taskly.com"
    }
  },
  servers: [
    {
      url: "http://localhost:4000/api/v1",
      description: "Local Development Server"
    },
    {
      url: "/api/v1",
      description: "Production Server (Relative)"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "48419cb7-ecdc-4869-aa72-520e7df5d43e" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
          createdAt: { type: "string", format: "date-time", example: "2026-06-12T16:00:00.000Z" }
        }
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "string", example: "b2bc0d45-4269-450b-96f4-aeb73ae88311" },
          title: { type: "string", example: "Finish Assignment" },
          description: { type: "string", example: "Complete the REST API and frontend dashboard." },
          status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "COMPLETED"], example: "PENDING" },
          userId: { type: "string", example: "48419cb7-ecdc-4869-aa72-520e7df5d43e" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Error: {
        type: "object",
        properties: {
          statusCode: { type: "integer", example: 400 },
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation Error" },
          errors: {
            type: "array",
            items: { type: "string" },
            example: ["title: Task title is required"]
          }
        }
      }
    }
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "SecurePass1" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusCode: { type: "integer", example: 201 },
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "User registered successfully" },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: "Validation Error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          409: { description: "Conflict — Email already in use", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },
    "/auth/login": {
      post: {
        summary: "Log in user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "SecurePass1" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusCode: { type: "integer", example: 200 },
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Login successful" },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: "Validation Error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
        }
      }
    },
    "/tasks": {
      get: {
        summary: "Get tasks",
        description: "Fetch tasks. A standard user receives only their own tasks. An ADMIN receives all tasks in the system.",
        tags: ["Tasks"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "List of tasks retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusCode: { type: "integer", example: 200 },
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Tasks retrieved successfully" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Task" }
                    }
                  }
                }
              }
            }
          },
          401: { description: "Unauthorized" }
        }
      },
      post: {
        summary: "Create a new task",
        tags: ["Tasks"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "Build REST API Docs" },
                  description: { type: "string", example: "Document auth and CRUD endpoints" },
                  status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "COMPLETED"], default: "PENDING" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Task created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusCode: { type: "integer", example: 201 },
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Task created successfully" },
                    data: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" }
        }
      }
    },
    "/tasks/{id}": {
      get: {
        summary: "Get task by ID",
        tags: ["Tasks"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Task UUID"
          }
        ],
        responses: {
          200: {
            description: "Task retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusCode: { type: "integer", example: 200 },
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden — Access denied to this task" },
          404: { description: "Task not found" }
        }
      },
      put: {
        summary: "Update task details",
        tags: ["Tasks"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Task UUID"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Updated Task Title" },
                  description: { type: "string", example: "Updated Description content" },
                  status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "COMPLETED"] }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Task updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusCode: { type: "integer", example: 200 },
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Task" }
                  }
                }
              }
            }
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Task not found" }
        }
      },
      delete: {
        summary: "Delete a task",
        tags: ["Tasks"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Task UUID"
          }
        ],
        responses: {
          200: {
            description: "Task deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusCode: { type: "integer", example: 200 },
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Task deleted successfully" }
                  }
                }
              }
            }
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Task not found" }
        }
      }
    },
    "/tasks/admin/all": {
      get: {
        summary: "Fetch all system tasks (ADMIN only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "All system tasks retrieved",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusCode: { type: "integer", example: 200 },
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Task" }
                    }
                  }
                }
              }
            }
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden — ADMIN role required" }
        }
      }
    }
  }
};

export const swaggerSetup = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("📖 API Documentation is wired under /api-docs");
};
