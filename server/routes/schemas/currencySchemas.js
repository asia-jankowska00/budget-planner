const Joi = require("joi");

const defaultCurrency = {
  id: Joi.number().integer().min(1).required(),
  code: Joi.string().min(1).max(255).required(),
  name: Joi.string().min(1).max(255).required(),
  symbol: Joi.string().min(1).max(255).required(),
}

// GET /currencies
const getCurrenciesOutput = Joi.array().items(Joi.object(defaultCurrency));

// GET /currencies/:currencyId
const defaultCurrencyOutput = Joi.object(defaultCurrency);

module.exports = {
  defaultCurrency,
  defaultCurrencyOutput,
  getCurrenciesOutput
};
