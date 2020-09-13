const Joi = require("joi");

// GET /profile
const getProfileOutput = Joi.object({
  id: Joi.number().integer().min(1).required(),
  username: Joi.string().min(1).max(255).required(),
  firstName: Joi.string().min(1).max(255).required(),
  lastName: Joi.string().min(1).max(255).required(),
  currency: Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).required(),
    code: Joi.string().min(1).required(),
  }),
});

// PATCH /profile
const patchProfileInput = Joi.object({
  username: Joi.string().min(1).max(255),
  password: Joi.string().min(1),
  firstName: Joi.string().min(1).max(255),
  lastName: Joi.string().min(1).max(255),
  currency: Joi.number().integer().min(1),
});

// PATCH /profile
const patchProfileOutput = Joi.object({
  id: Joi.number().integer().min(1).required(),
  username: Joi.string().min(1).max(255).required(),
  firstName: Joi.string().min(1).max(255).required(),
  lastName: Joi.string().min(1).max(255).required(),
  currency: Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).required(),
    code: Joi.string().min(1).required(),
  }),
});

module.exports = {
  getProfileOutput,
  patchProfileInput,
  patchProfileOutput,
};
