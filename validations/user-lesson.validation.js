const joi = require("joi");

const watchLessonSchema = joi.object({
  lessonId: joi.string().hex().length(24).required().messages({
    "any.required": "Lesson ID is required",
    "string.hex": "Lesson ID must be a valid MongoDB ObjectId",
    "string.length": "Lesson ID must be exactly 24 characters long",
  }),
  lastPosition: joi.number().min(0).required().messages({
    "number.min": "Last position must be greater than 0",
    "any.required": "Last position is required",
  }),
});

module.exports = {
  watchLessonSchema,
};
