const Joi = require("joi");

// GET /users&q=queryString

const defaultUser = {
  id: Joi.number().integer().min(1).required(),
  username: Joi.string().min(1).max(255).required(),
  firstName: Joi.string().min(1).max(255).required(),
  lastName: Joi.string().min(1).max(255).required(),
} 

const searchUsersOutput = Joi.array().items(Joi.object(defaultUser));

module.exports = { 
  defaultUser,
  searchUsersOutput 
};
