const validate = (schema) => {
  return (req, res, next) => {
    // stripUnknown: true is used to delete any unknown fields from the request body
    const { error } = schema.validate(req.body, { stripUnknown: true });
    if (error) {
      return next({
        status: 400,
        message: error.details[0].message,
      });
    }

    next();
  };
};

module.exports = validate;
