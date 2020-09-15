const Joi = require("joi");
const { defaultCurrency } = require("./currencySchemas");
const { defaultUser } = require('./userSchemas');

// GET /profile
const defaultProfileOutput = Joi.object({
  ...defaultUser,
  currency: Joi.object(defaultCurrency),
});

// PATCH /profile
const patchProfileInput = Joi.object({
  username: Joi.string().min(1).max(255),
  password: Joi.string().min(1),
  firstName: Joi.string().min(1).max(255),
  lastName: Joi.string().min(1).max(255),
  currencyId: Joi.number().integer().min(1)
});

module.exports = {
  defaultProfileOutput,
  patchProfileInput,
};
