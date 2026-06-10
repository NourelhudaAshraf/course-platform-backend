const joi = require("joi");

const createCourseSchema = joi.object({
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
  price: joi.number().min(0).required().messages({
    "number.min": "Price must be greater than 0",
    "any.required": "Price is required",
  }),
});

const updateCourseSchema = joi.object({
  title: joi.string().min(3).max(100).messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must be less than 100 characters long",
  }),
  description: joi.string().min(10).max(1000).messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must be less than 1000 characters long",
  }),
  price: joi.number().min(0).messages({
    "number.min": "Price must be greater than 0",
  }),
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
};
