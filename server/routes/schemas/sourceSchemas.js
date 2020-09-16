const Joi = require("joi");
const { defaultCurrency } = require('./currencySchemas');
const { defaultProfileOutput } = require('./profileSchemas');

const defaultSource = {
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(255).empty(''),
    amount: Joi.number().precision(2).required(),
    convertedAmount: Joi.number().precision(2),
    currency: Joi.object(defaultCurrency),
    owner: defaultProfileOutput
}

const defaultSourceOutput = Joi.object(defaultSource)

// POST /sources -- create & send to DB
const postSourcesInput = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(255).empty(''),
    amount: Joi.number().precision(4).required(),
    currencyId: Joi.number().integer().min(1).required()
});

// GET /sources -- get * where user has access to from DB & send to client
// GET /sources/owner
const getSourcesOutput = Joi.array().items(Joi.object(defaultSource));

// PATCH /source/:sourceId
const patchSourceInput = Joi.object({
    name: Joi.string().min(1).max(255),
    description: Joi.string().max(255).empty(''),
    amount: Joi.number().precision(2),
    currencyId: Joi.number().integer().min(1)
});


module.exports = {
    defaultSource,
    postSourcesInput,
    getSourcesOutput,
    patchSourceInput,
    defaultSourceOutput
}