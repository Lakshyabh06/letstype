const { z } = require("zod");

const emailSchema = z
  .string()
  .trim()
  .email("Email must be valid")
  .max(255, "Email must be at most 255 characters")
  .transform((email) => email.toLowerCase());

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),
  email: emailSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required")
});

const googleLoginSchema = z.object({
  credential: z
    .string()
    .trim()
    .min(1, "Google credential is required")
    .max(4096, "Google credential is too large")
});

module.exports = {
  googleLoginSchema,
  loginSchema,
  registerSchema
};
