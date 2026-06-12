import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "PORT must be a positive number",
    })
    .default("4000"),
  DATABASE_URL: z.string().url({
    message: "DATABASE_URL must be a valid connection URL string",
  }),
  JWT_SECRET: z.string().min(8, {
    message: "JWT_SECRET must be at least 8 characters long",
  }),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment configuration:");
    result.error.errors.forEach((err) => {
      console.error(`   - ${err.path.join(".")}: ${err.message}`);
    });
    process.exit(1);
  }

  return result.data;
};

const env = parseEnv();

export default env;
