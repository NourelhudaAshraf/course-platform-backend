const joi = require("joi");

const objectIdParam = (name, label = "ID") =>
  joi.object({
    [name]: joi.string().hex().length(24).required().messages({
      "string.hex": `Invalid ${label}`,
      "string.length": `Invalid ${label}`,
      "any.required": `${label} is required`,
    }),
  });

const courseIdParamSchema = objectIdParam("courseId", "course ID");
const idParamSchema = objectIdParam("id");

module.exports = {
  courseIdParamSchema,
  idParamSchema,
};
