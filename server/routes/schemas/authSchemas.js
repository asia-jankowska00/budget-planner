const Joi = require("joi");
const { defaultUser } = require('./userSchemas');
const { defaultCurrency } = require('./currencySchemas');

// POST /register
const registerInput = Joi.object({
  username: Joi.string().min(1).required(),
  password: Joi.string().min(1).required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  currency: Joi.number().integer().min(1).required(),
});

// POST /register
const registerOutput = Joi.object({
  ...defaultUser,
  currency: Joi.object(defaultCurrency),
  token: Joi.string().min(1).required(),
});

// POST /login
const loginInput = Joi.object({
  username: Joi.string().min(1).required(),
  password: Joi.string().min(1).required(),
});

// POST /login
const loginOutput = Joi.object({
  ...defaultUser,
  currency: Joi.object(defaultCurrency),
  token: Joi.string().min(1).required(),
});

module.exports = {
  registerInput,
  registerOutput,
  loginInput,
  loginOutput,
};
