const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next({
        status: 400,
        message: error.details.map((err) => err.message),
      });
    }

    next();
  };
};

module.exports = validate;
