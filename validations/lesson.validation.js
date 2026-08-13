const joi = require("joi");

const createLessonSchema = joi.object({
  title: joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must be less than 100 characters long",
    "any.required": "Title is required",
  }),
  description: joi.string().min(10).max(1000).required().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must be less than 1000 characters long",
    "any.required": "Description is required",
  }),
  order: joi.number().min(1).required().messages({
    "number.min": "Order must be greater than or equal to 1",
    "any.required": "Order is required",
  }),
});

const updateLessonSchema = joi.object({
  title: joi.string().min(3).max(100).empty("").messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must be less than 100 characters long",
  }),
  description: joi.string().min(10).max(1000).empty("").messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must be less than 1000 characters long",
  }),
  order: joi.number().min(1).empty("").messages({
    "number.min": "Order must be greater than or equal to 1",
  }),
});

const lessonIdParamSchema = joi.object({
  id: joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid lesson ID",
    "string.length": "Invalid lesson ID",
    "any.required": "Lesson ID is required",
  }),
});

module.exports = {
  createLessonSchema,
  updateLessonSchema,
  lessonIdParamSchema,
};
