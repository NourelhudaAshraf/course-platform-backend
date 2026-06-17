const joi = require("joi");

const watchLessonSchema = joi.object({
  lessonId: joi.string().required().messages({
    "any.required": "Lesson ID is required",
  }),
  lastPosition: joi.number().min(0).required().messages({
    "number.min": "Last position must be greater than 0",
    "any.required": "Last position is required",
  }),
});

module.exports = {
  watchLessonSchema,
};
