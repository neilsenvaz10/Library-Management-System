const { errorResponse } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return errorResponse(res, 400, errorMessage);
    }
    next();
  };
};

module.exports = validate;
