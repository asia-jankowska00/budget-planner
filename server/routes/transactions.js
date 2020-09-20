const express = require("express");
const router = express.Router({ mergeParams: true });
const Transaction = require('../models/transaction');
const Source = require('../models/source');
const Container = require('../models/container');
const transactionSchemas = require('./schemas/transactionSchemas');

module.exports = router;

router.get('/', async (req, res) => {
  try {
    const params = req.params;

    if (params.sourceId) {
      // verify if user has access on the source
      await Source.checkOwner(params.sourceId, req.user)

      // getAll transactions by SourceId
      const transactions = await Transaction.getAllSourceTransactions(params.sourceId);
      
      //validate transactions output
      await transactionSchemas.getAllTransactions.validateAsync(transactions)

      res.json(transactions)
    } else if (params.containerId) {
      // verify if user has access on the source
      await Container.checkOwner(params.containerId, req.user)

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
      await Source.checkOwner(params.sourceId, req.user)

      // getAll transactions by SourceId
      const transaction = Transaction.getSourceTransaction(params.sourceId, params.transactionId);
      
      //validate transactions output
      await transactionSchemas.defaultTransactionOutput.validateAsync(transaction)

      res.json(transaction)
    } else if (params.containerId) {
      // verify if user has access on the source
      await Container.checkOwner(params.containerId, req.user)

      // getAll transactions by SourceId
      const transaction = Transaction.getContainerTransaction(params.containerId, params.transactionId);
      
      //validate transactions output
      await transactionSchemas.defaultTransactionOutput.validateAsync(transactions)

      res.json(transaction)
    }
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const transaction = Transaction.create(req.body, req.user)
    
    res.status(201).json(transaction)
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});