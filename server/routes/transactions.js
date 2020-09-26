const express = require("express");
const router = express.Router({ mergeParams: true });
const Transaction = require('../models/transaction');
const Source = require('../models/source');
const Container = require('../models/container');
const Category = require('../models/category');
const transactionSchemas = require('./schemas/transactionSchemas');
const User = require("../models/user");

module.exports = router;

router.get('/', async (req, res) => {
  try {
    const params = req.params;

    if (params.sourceId) {
      // verify if user has access on the source
      await Source.checkOwner(params.sourceId, req.user.id)

      // getAll transactions by SourceId
      const transactions = await Transaction.getAllSourceTransactions(params.sourceId);
      
      //validate transactions output
      await transactionSchemas.getAllTransactions.validateAsync(transactions)

      res.json(transactions)
    } else if (params.containerId) {
      // verify if user has access on the source
      await Container.checkUserContainer(req.user.id, params.containerId)

      // getAll transactions by SourceId
      const transactions = await Transaction.getAllContainerTransactions(params.containerId);
      
      //validate transactions output
      await transactionSchemas.getAllTransactions.validateAsync(transactions)

      res.json(transactions)
    }
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

router.get('/:transactionId', async (req, res) => {
  try {
    const params = req.params;

    if (params.sourceId) {
      // verify if user has access on the source
      await Source.checkOwner(params.sourceId, req.user.id)

      // getAll transactions by SourceId
      const transaction = await Transaction.getSourceTransaction(params.sourceId, params.transactionId);
      
      //validate transactions output
      await transactionSchemas.defaultTransactionOutput.validateAsync(transaction)

      res.json(transaction)
    } else if (params.containerId) {
      // verify if user has access on the source
      await Container.checkUserContainer(req.user.id, params.containerId)

      // getAll transactions by SourceId
      const transaction = await Transaction.getContainerTransaction(params.containerId, params.transactionId);
      
      //validate transactions output
      await transactionSchemas.defaultTransactionOutput.validateAsync(transaction)

      res.json(transaction)
    }
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    await transactionSchemas.defaultTransactionInput.validateAsync(req.body);

    const userContainerId = await Container.checkUserContainer(req.user.id, req.body.containerId);

    const sourceContainerId = await Container.checkSourceContainer(req.body.sourceId,  req.body.containerId);

    await Container.checkUserSourceContainer(userContainerId, sourceContainerId)

    await Category.checkContainerCategory(req.body.containerId, req.body.categoryId)

    const user = await User.readById(req.user.id);

    const newTransaction = await Transaction.create(req.body, user);

    await transactionSchemas.defaultTransactionOutput.validateAsync(newTransaction)
    
    res.status(201).json(newTransaction)
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});