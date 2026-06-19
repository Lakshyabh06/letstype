const { z } = require("zod");

const createSessionSchema = z
  .object({
    wpm: z
      .number({
        invalid_type_error: "WPM must be a number"
      })
      .min(0, "WPM must be at least 0")
      .max(1000, "WPM must be at most 1000"),
    accuracy: z
      .number({
        invalid_type_error: "Accuracy must be a number"
      })
      .min(0, "Accuracy must be at least 0")
      .max(100, "Accuracy must be at most 100"),
    errors: z
      .number({
        invalid_type_error: "Errors must be a number"
      })
      .int("Errors must be a whole number")
      .min(0, "Errors must be at least 0"),
    duration: z
      .number({
        invalid_type_error: "Duration must be a number"
      })
      .int("Duration must be a whole number")
      .positive("Duration must be greater than 0"),
    mode: z
      .string()
      .trim()
      .min(1, "Mode is required")
      .max(80, "Mode must be at most 80 characters")
  })
  .strict();

module.exports = {
  createSessionSchema
};
