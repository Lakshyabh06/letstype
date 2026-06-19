const { z } = require("zod");

const upsertProgressSchema = z
  .object({
    lessonId: z
      .string()
      .trim()
      .min(1, "Lesson ID is required")
      .max(120, "Lesson ID must be at most 120 characters"),
    completion: z
      .number({
        invalid_type_error: "Completion must be a number"
      })
      .min(0, "Completion must be at least 0")
      .max(100, "Completion must be at most 100"),
    masteryScore: z
      .number({
        invalid_type_error: "Mastery score must be a number"
      })
      .min(0, "Mastery score must be at least 0")
      .max(100, "Mastery score must be at most 100")
  })
  .strict();

module.exports = {
  upsertProgressSchema
};
