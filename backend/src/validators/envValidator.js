const { z } = require("zod");

const optionalEnvString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().min(1).optional()
);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce
    .number()
    .int()
    .positive()
    .max(65535)
    .default(5000),
  DATABASE_URL: z
    .string()
    .trim()
    .min(1, "DATABASE_URL is required")
    .url("DATABASE_URL must be a valid PostgreSQL connection URL")
    .refine(
      (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
      "DATABASE_URL must use the postgresql:// or postgres:// protocol"
    ),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),
  GOOGLE_CLIENT_ID: optionalEnvString.refine(
    (value) => !value || value.endsWith(".apps.googleusercontent.com"),
    "GOOGLE_CLIENT_ID must be a Google OAuth web client ID"
  )
});

module.exports = {
  envSchema
};
