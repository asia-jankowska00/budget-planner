const Joi = require("joi");
const { defaultContainer } = require("./containerSchemas");

const defaultCategory = {
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).max(255).required()
}

module.exports = {
    defaultCategory
}