const Joi = require("joi");

// POST /sources -- create & send to DB

const postSourcesInput = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(255).empty(''),
    amount: Joi.number().precision(4).required(),
    currencyId: Joi.number().integer().min(1).required()
});

// POST /sources -- receive from DB & send to client

const postSourcesOutput = Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(255).empty(''),
    amount: Joi.number().precision(4).required(),
    currency: Joi.object({
        id: Joi.number().integer().min(1).required(),
        name: Joi.string().min(1).required(),
        code: Joi.string().min(1).max(3).required(),
        symbol: Joi.string().min(1).max(50).required()
    })
});

// GET /sources -- get * where user has access to from DB & send to client
// GET /sources/owner

const getSourcesOutput = Joi.array().items(Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(255).empty(''),
    amount: Joi.number().precision(2).required(),
    convertedAmount: Joi.number().precision(2),
    currency: Joi.object({
        id: Joi.number().integer().min(1).required(),
        name: Joi.string().min(1).required(),
        code: Joi.string().min(1).max(3).required(),
        symbol: Joi.string().min(1).max(50).required()
    })
}));

// GET /sources/:sourceId

const getSourceIdOutput = Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(255).empty(''),
    amount: Joi.number().precision(2).required(),
    currency: Joi.object({
        id: Joi.number().integer().min(1).required(),
        name: Joi.string().min(1).required(),
        code: Joi.string().min(1).max(3).required(),
        symbol: Joi.string().min(1).max(50).required()
    })
});

// PATCH /source/:sourceId

const patchSourceInput = Joi.object({
    name: Joi.string().min(1).max(255),
    description: Joi.string().max(255).empty(''),
    amount: Joi.number().precision(2),
    currencyId: Joi.number().integer().min(1)
});

const patchSourceOutput = Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(255).empty(''),
    amount: Joi.number().precision(2).required(),
    currency: Joi.object({
        id: Joi.number().integer().min(1).required(),
        name: Joi.string().min(1).required(),
        code: Joi.string().min(1).max(3).required(),
        symbol: Joi.string().min(1).max(50).required()
     })//,
    // lastTransactions: Joi.array().length(5).items(Joi.object({
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
});

// GET /source/:sourceId/containers

const getSourceContainersOutput = Joi.array().items(Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(1).max(255).required(),
    user: Joi.object({
        id: Joi.number().integer().min(1).required(),
        username: Joi.string().min(1).max(255).required(),
        firstName: Joi.string().min(1).max(255).required(),
        lastName: Joi.string().min(1).max(255).required() 
    })
}));

module.exports = {
    postSourcesInput,
    postSourcesOutput,
    getSourcesOutput,
    getSourceIdOutput,
    patchSourceInput,
    patchSourceOutput,
    getSourceContainersOutput
}