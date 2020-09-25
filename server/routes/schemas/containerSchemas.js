const Joi = require("joi");
const { defaultSourceOutput } = require("./sourceSchemas");
const { defaultUserWithCurrency } = require("./userSchemas");

const defaultContainer = {
  id: Joi.number().integer().min(1).required(),
  name: Joi.string().min(1).max(255).required(),
  sources: Joi.array().items(defaultSourceOutput),
  owner: defaultUserWithCurrency,
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

const defaultContainerOutput = Joi.object(defaultContainer);

// POST /containers

const postContainersInput = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  sources: Joi.array().items(Joi.number().integer().min(1)).required(),
});

const postContainersOutput = defaultContainerOutput;

// GET /containers

const getContainersOutput = Joi.array().items(defaultContainerOutput);

// GET /container/:containerId

const getContainerIdOutput = defaultContainerOutput;

// PATCH /container/:containerId

const patchContainerInput = Joi.object({
  id: Joi.number().integer().min(1),
  name: Joi.string().min(1).max(255),
  sources: Joi.array(),
  owner: defaultUserWithCurrency,
  collaborators: Joi.array(),
});

const patchContainerOutput = Joi.object(defaultContainer);

module.exports = {
  defaultContainer,
  defaultContainerOutput,
  postContainersInput,
  postContainersOutput,
  getContainersOutput,
  getContainerIdOutput,
  patchContainerInput,
  patchContainerOutput,
};
