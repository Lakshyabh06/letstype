const { ZodError } = require("zod");

const { HttpError } = require("../utils/httpError");

const formatZodIssues = (issues) =>
  issues
    .map((issue) => {
      const path = issue.path.join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join("; ");

const validateRequest = (schema) => (req, _res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      next(new HttpError(400, formatZodIssues(error.issues)));
      return;
    }

    next(error);
  }
};

module.exports = {
  validateRequest
};
