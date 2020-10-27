const joi = require("joi");

const registerValidations = (data) => {
  const schema = joi.object({
    name: joi.string().min(6).required(),
    email: joi.string().required().email().min(6),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};
const loginValidations = (data) => {
  const schema = joi.object({
    email: joi.string().required().email().min(6),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports = { registerValidations, loginValidations };
