const Joi = require("joi");

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
  id: Joi.number().integer().min(1).required(),
  username: Joi.string().min(1).required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  currency: Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).required(),
    code: Joi.string().min(1).max(3).required(),
    symbol: Joi.string().min(1).max(50).required() 
  }),
  token: Joi.string().min(1).required(),
});

// POST /login
const loginInput = Joi.object({
  username: Joi.string().min(1).required(),
  password: Joi.string().min(1).required(),
});

// POST /login
const loginOutput = Joi.object({
  id: Joi.number().integer().min(1).required(),
  username: Joi.string().min(1).required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  currency: Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).required(),
    code: Joi.string().min(1).required(),
    symbol: Joi.string().min(1).max(50).required() 
  }),
  token: Joi.string().min(1).required(),
});

module.exports = {
  registerInput,
  registerOutput,
  loginInput,
  loginOutput,
};
