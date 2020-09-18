const Joi = require("joi");
const { defaultCurrency } = require("./currencySchemas");

const defaultUser = {
  id: Joi.number().integer().min(1).required(),
  username: Joi.string().min(1).max(255).required(),
  firstName: Joi.string().min(1).max(255).required(),
  lastName: Joi.string().min(1).max(255).required(),
};

const defaultUserWithCurrency = Joi.object({
  ...defaultUser,
  currency: Joi.object(defaultCurrency),
});

// GET /users&q=queryString

const searchUsersOutput = Joi.array().items(Joi.object(defaultUser));

module.exports = {
  defaultUser,
  defaultUserWithCurrency,
  searchUsersOutput,
};
