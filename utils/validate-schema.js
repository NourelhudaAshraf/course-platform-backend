const OPTIONS = {
  stripUnknown: true,
  convert: true,
};

const createValidator = (source) => (schema) => (req, res, next) => {
  if (source === "body") {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "") {
        delete req.body[key];
      }
    });
  }
  const { value, error } = schema.validate(req[source], OPTIONS);
  if (error) {
    console.log(error);
    return next({
      status: 400,
      message: error.details[0].message,
    });
  }
  // params accumulate across nested routers (e.g. /courses/:courseId/lessons/:id),
  // so merge instead of replacing to avoid dropping params validated by a parent router.
  req[source] = source === "params" ? { ...req.params, ...value } : value;
  next();
};

const validate = createValidator("body");
const validateParams = createValidator("params");
const validateQuery = createValidator("query");

module.exports = validate;
module.exports.validateParams = validateParams;
module.exports.validateQuery = validateQuery;
