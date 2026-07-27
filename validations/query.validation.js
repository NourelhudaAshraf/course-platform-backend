const joi = require("joi");

const createSortValidator = (allowedFields) =>
  joi
    .string()
    .custom((value, helpers) => {
      const fields = value.split(",");
      for (const field of fields) {
        const name = field.startsWith("-") ? field.slice(1) : field;
        if (!allowedFields.includes(name)) {
          return helpers.error("any.invalid");
        }
      }
      return value;
    })
    .messages({
      "any.invalid": `Sort must use one of: ${allowedFields.join(", ")}`,
    });

const page = joi.number().integer().min(1).messages({
  "number.base": "Page must be a number",
  "number.min": "Page must be at least 1",
});

const limit = joi.number().integer().min(1).max(25).messages({
  "number.base": "Limit must be a number",
  "number.min": "Limit must be at least 1",
  "number.max": "Limit must be at most 25",
});

const listCoursesQuerySchema = joi.object({
  page,
  limit,
  sort: createSortValidator(["title", "price", "createdAt"]),
  title: joi.string().trim().max(100).messages({
    "string.max": "Title search must be less than 100 characters",
  }),
  minPrice: joi.number().min(0).messages({
    "number.min": "Minimum price cannot be negative",
  }),
  maxPrice: joi.number().min(0).messages({
    "number.min": "Maximum price cannot be negative",
  }),
});

const listLessonsQuerySchema = joi.object({
  page,
  limit,
  sort: createSortValidator(["order", "title", "createdAt"]),
});

const listUsersQuerySchema = joi.object({
  page,
  limit,
  sort: createSortValidator(["name", "email", "role", "createdAt"]),
});

const listEnrollmentsQuerySchema = joi.object({
  page,
  limit,
  sort: createSortValidator(["price", "paymentStatus", "createdAt"]),
  minPrice: joi.number().min(0).messages({
    "number.min": "Minimum price cannot be negative",
  }),
  maxPrice: joi.number().min(0).messages({
    "number.min": "Maximum price cannot be negative",
  }),
});

module.exports = {
  listCoursesQuerySchema,
  listLessonsQuerySchema,
  listUsersQuerySchema,
  listEnrollmentsQuerySchema,
};
