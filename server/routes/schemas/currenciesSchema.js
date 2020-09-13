const Joi = require("joi");

// GET /currencies
const getCurrenciesOutput = Joi.array().items(
  Joi.object({
    id: Joi.number().integer().min(1).required(),
    code: Joi.string().min(1).max(255).required(),
    name: Joi.string().min(1).max(255).required(),
    symbol: Joi.string().min(1).max(255).required(),
  })
);

// GET /currencies/:currencyId
const getCurrencyIdOutput = Joi.object({
  id: Joi.number().integer().min(1).required(),
  code: Joi.string().min(1).max(255).required(),
  name: Joi.string().min(1).max(255).required(),
  symbol: Joi.string().min(1).max(255).required(),
});

module.exports = {
  getCurrenciesOutput,
  getCurrencyIdOutput,
};
