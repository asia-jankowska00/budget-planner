const Joi = require("joi");

const { defaultUserWithCurrency } = require("./userSchemas");

// GET /profile
const defaultProfileOutput = defaultUserWithCurrency;

// PATCH /profile
const patchProfileInput = Joi.object({
  username: Joi.string().min(1).max(255),
  password: Joi.string().empty(''),
  firstName: Joi.string().min(1).max(255),
  lastName: Joi.string().min(1).max(255),
  currency: Joi.number().integer().min(1),
});

module.exports = {
  defaultProfileOutput,
  patchProfileInput,
};
