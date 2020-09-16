const Joi = require("joi");
const { defaultSource } = require("./sourceSchemas");

const defaultContainer = {
  id: Joi.number().integer().min(1).required(),
  name: Joi.string().min(1).max(255).required(),
  sources: Joi.array().items(Joi.object(defaultSource)),
  // categories: Joi.array().items(
  //   Joi.object({
  //     id: Joi.number().integer().min(1).required(),
  //     name: Joi.string().min(1).max(255).required(),
  //   })
  // ),
  // latestTransactions: Joi.array().length(5).items(Joi.object({
  //     id: Joi.number().integer().min(1).required(),
  //     name: Joi.string().min(1).max(255).required(),
  //     date: Joi.date().required(),
  //     amount: Joi.number().precision(2).required(),
  //     isExpense: Joi.bool().required(),
  //     note: Joi.string().min(1).max(255),
  //     categoryName: Joi.string().min(1).max(255),
  //     user: Joi.object({
  //         id: Joi.number().integer().min(1).required(),
  //         username: Joi.string().min(1).max(255).required(),
  //         firstName: Joi.string().min(1).max(255).required(),
  //         lastName: Joi.string().min(1).max(255).required()
  //     })

  //   }))
};

// POST /containers

const postContainersInput = Joi.object({
  id: Joi.number().integer().min(1).required(),
  name: Joi.string().min(1).max(255).required(),
  sources: Joi.array().items(Joi.number().integer().min(1).required()),
});

const postContainersOutput = Joi.object(defaultContainer);

// GET /containers

const getContainersOutput = Joi.array().items(Joi.object(defaultContainer));

// GET /container/:containerId

const getContainerIdOutput = Joi.object(defaultContainer);

// PATCH /container/:containerId

const patchContainerInput = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  collaborators: Joi.array(),
});

const patchContainerIdOutput = Joi.object(defaultContainer);

module.exports = {
  defaultContainer,
  postContainersInput,
  postContainersOutput,
  getContainersOutput,
  getContainerIdOutput,
  patchContainerInput,
  patchContainerIdOutput,
};
