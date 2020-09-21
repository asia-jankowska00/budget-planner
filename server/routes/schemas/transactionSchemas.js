const Joi = require('joi');
const { defaultUser } = require('./userSchemas');
const { defaultCurrency } = require('./currencySchemas');

const defaultTransaction = {
  id: Joi.number().integer().min(1).required(),
  name: Joi.string().min(1).max(255).required(),
  date: Joi.date().required(),
  amount: Joi.number().precision(4).required(),
  isExpense: Joi.bool().required(),
  note: Joi.string().min(1).max(255),
  user: Joi.object(defaultUser),
  source: Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).max(255).required(),
    currency: Joi.object({defaultCurrency})
  })
}

const postTransactionInput = {
  name: Joi.string().min(1).max(255).required(),
  date: Joi.date().required(),
  amount: Joi.number().precision(4).required(),
  isExpense: Joi.bool().required(),
  note: Joi.string().min(1).max(255),
  containerId: Joi.number().integer().min(1).required(),
  sourceId: Joi.number().integer().min(1).required(),
  categoryId: Joi.number().integer().min(1)
}

const defaultTransactionOutput = Joi.object(defaultTransaction);
const getAllTransactions = Joi.array().items(defaultTransactionOutput);

module.exports = {
  defaultTransaction,
  postTransactionInput,
  defaultTransactionOutput,
  getAllTransactions
}