const { z } = require("zod");

const updateSettingsSchema = z
  .object({
    theme: z
      .enum(["dark", "light", "system"], {
        errorMap: () => ({ message: "Theme must be dark, light, or system" })
      })
      .optional(),
    soundProfile: z
      .string()
      .trim()
      .min(1, "Sound profile is required")
      .max(80, "Sound profile must be at most 80 characters")
      .optional(),
    volume: z
      .number({
        invalid_type_error: "Volume must be a number"
      })
      .int("Volume must be an integer")
      .min(0, "Volume must be at least 0")
      .max(100, "Volume must be at most 100")
      .optional()
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one settings field is required"
  });

module.exports = {
  updateSettingsSchema
};
