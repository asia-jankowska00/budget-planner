const Joi = require("joi");

const UserSchema = {
  // input
  createInput: Joi.object({
    username: Joi.string().min(1).required(),
    password: Joi.string().min(1).required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    isDisabled: Joi.boolean(),
    currency: Joi.object({
      id: Joi.number().integer().min(1).required(),
    }),
  }),

  loginInput: Joi.object({
    username: Joi.string().min(1).required(),
    password: Joi.string().min(1).required(),
  }),

  readByIdInput: Joi.number().integer().min(1).required(),

  readByUsernameInput: Joi.string().min(1).required(),

  // output
  createOutput: Joi.object({
    id: Joi.number().integer().min(1).required(),
    username: Joi.string().min(1).required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    isDisabled: Joi.boolean().required(),
    currency: Joi.object({
      id: Joi.number().integer().min(1).required(),
      name: Joi.string().min(1).required(),
      code: Joi.string().min(1).required(),
    }),
  }),

  readOneOutput: Joi.object({
    id: Joi.number().integer().min(1).required(),
    username: Joi.string().min(1).required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    isDisabled: Joi.boolean().required(),
    currency: Joi.object({
      id: Joi.number().integer().min(1).required(),
      name: Joi.string().min(1).required(),
      code: Joi.string().min(1).required(),
    }),
    sources: Joi.array(),
    containers: Joi.array(),
  }),
};

module.exports = UserSchema;
