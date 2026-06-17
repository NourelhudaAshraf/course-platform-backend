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

const updateUserSchema = joi.object({
  name: joi.string().min(3).max(30).optional().messages({
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must be less than 30 characters long",
  }),
  email: joi.string().email().optional().messages({
    "string.email": "Invalid email",
  }),
});

const forgotPasswordSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Invalid email",
    "any.required": "Email is required",
  }),
});

const resetPasswordSchema = joi.object({
  password: joi.string().min(8).max(30).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be less than 30 characters long",
    "any.required": "Password is required",
  }),
});

const updatePasswordSchema = joi.object({
  currentPassword: joi.string().min(8).max(30).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be less than 30 characters long",
    "any.required": "Password is required",
  }),
  newPassword: joi
    .string()
    .min(8)
    .max(30)
    .invalid(joi.ref("currentPassword"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be less than 30 characters long",
      "any.required": "Password is required",
      "any.invalid": "New password cannot be the same as the old password",
    }),
});

module.exports = {
  signupSchema,
  loginSchema,
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
};
