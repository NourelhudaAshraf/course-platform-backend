const joi = require("joi");

const signupSchema = joi.object({
  name: joi.string().min(3).max(30).required().messages({
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must be less than 30 characters long",
    "any.required": "Name is required",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
  password: joi.string().min(8).max(30).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be less than 30 characters long",
    "any.required": "Password is required",
  }),
  role: joi.string().valid("user", "admin").default("user").messages({
    "any.only": "Invalid role must be user or admin",
  }),
});

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
  password: joi.string().min(8).max(30).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be less than 30 characters long",
    "any.required": "Password is required",
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
};
