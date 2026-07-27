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
  const { error } = schema.validate(req[source], OPTIONS);
  if (error) {
    console.log(error);
    return next({
      status: 400,
      message: error.details[0].message,
    });
  }
  next();
};

const validate = createValidator("body");
const validateParams = createValidator("params");
const validateQuery = createValidator("query");

module.exports = validate;
module.exports.validateParams = validateParams;
module.exports.validateQuery = validateQuery;
