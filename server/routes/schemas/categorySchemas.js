const Joi = require("joi");
const { defaultContainer } = require("./containerSchemas");

const defaultCategory = {
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).max(255).required(),
    containerId: Joi.number().integer().min(1).required(),
    estimation: Joi.number().integer().min(0)
}

const defaultOutputCategory = Joi.object(defaultCategory);

const postInputCategory = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    estimation: Joi.number().integer().min(0)
})

const patchInputCategory = Joi.object({
    name: Joi.string().min(1).max(255),
    estimation: Joi.number().integer().min(0)
})

const getCategoriesOutput = Joi.array().items(defaultOutputCategory);

module.exports = {
    defaultCategory,
    defaultOutputCategory,
    postInputCategory,
    patchInputCategory,
    getCategoriesOutput
}