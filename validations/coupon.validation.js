const joi = require("joi");

const createCouponSchema = joi.object({
  code: joi.string().trim().min(3).max(30).uppercase().required().messages({
    "string.empty": "Coupon code is required",
    "string.min": "Coupon code must be at least 3 characters",
    "string.max": "Coupon code cannot exceed 30 characters",
    "any.required": "Coupon code is required",
  }),
  percentage: joi.number().min(1).max(100).required().messages({
    "number.base": "Percentage must be a number",
    "number.min": "Percentage must be at least 1",
    "number.max": "Percentage cannot exceed 100",
    "any.required": "Percentage is required",
  }),
  startDate: joi.date().optional(),
  expiryDate: joi.date().required().greater(joi.ref("startDate")).messages({
    "date.base": "Expiry date must be a valid date",
    "date.greater": "Expiry date must be after start date",
    "any.required": "Expiry date is required",
  }),
  usageLimit: joi
    .number()
    .integer()
    .positive()
    .allow(null)
    .default(null)
    .messages({
      "number.base": "Usage limit must be a number",
      "number.integer": "Usage limit must be an integer",
      "number.positive": "Usage limit must be greater than 0",
    }),
  isActive: joi.boolean().default(true),
});

const updateCouponSchema = joi
  .object({
    code: joi.string().trim().min(3).max(30).uppercase().messages({
      "string.empty": "Coupon code is required",
      "string.min": "Coupon code must be at least 3 characters",
      "string.max": "Coupon code cannot exceed 30 characters",
      "any.required": "Coupon code is required",
    }),
    percentage: joi.number().min(1).max(100).messages({
      "number.base": "Percentage must be a number",
      "number.min": "Percentage must be at least 1",
      "number.max": "Percentage cannot exceed 100",
      "any.required": "Percentage is required",
    }),
    startDate: joi.date(),
    expiryDate: joi.date().greater(joi.ref("startDate")).messages({
      "date.base": "Expiry date must be a valid date",
      "date.greater": "Expiry date must be after start date",
      "any.required": "Expiry date is required",
    }),
    usageLimit: joi.number().integer().positive().allow(null).messages({
      "number.base": "Usage limit must be a number",
      "number.integer": "Usage limit must be an integer",
      "number.positive": "Usage limit must be greater than 0",
    }),
    isActive: joi.boolean(),
  })
  .min(1); // this means can not receive empty body

const validateCouponSchema = joi.object({
  code: joi.string().trim().min(3).max(30).uppercase().required(),
  courseId: joi.string().required(),
});
module.exports = {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema,
};
