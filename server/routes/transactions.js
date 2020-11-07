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
      // verify if user is in the container
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

router.patch("/:transactionId", async (req, res) => {
  try {
    await transactionSchemas.patchTransactionInput.validateAsync(req.body)

    const params = req.params;

    if (params.sourceId) {
      // check if requester is source owner
      await Source.checkOwner(params.sourceId, req.user.id);

      // check if transaction exists
      const transaction = await Transaction.getSourceTransaction(params.sourceId, params.transactionId);

      // update fetched transaction
      await transaction.update(req.body, req.user)

      res.json(transaction);

    } else if (params.containerId) {

      // check if requester has access to container
      const userContainerId = await Container.checkUserContainer(req.user.id, params.containerId);

      // get the source of the transaction
      const sourceId = await Transaction.getTransactionSource(params.transactionId)

      // check if source is in container
      const sourceContainerId = await Container.checkSourceContainer(sourceId, params.containerId);

      // check if user has access to the source of this transaction in this container
      await Container.checkUserSourceContainer(userContainerId, sourceContainerId)

      // check if transaction exists
      const transaction = await Transaction.getContainerTransaction(params.containerId, params.transactionId);

      // update fetched transaction
      await transaction.update(req.body, req.user)

      await transactionSchemas.defaultTransactionOutput.validateAsync(transaction)

      res.json(transaction);
    }
  } catch (err) {
    console.log(err)
    res.status(err.status || 400).json(err);
  }
});

router.delete("/:transactionId", async (req, res) => {
  try {
    const params = req.params;

    if (params.sourceId) {
      // check if requester is source owner
      await Source.checkOwner(params.sourceId, req.user.id);

      // check if transaction exists
      await Transaction.getSourceTransaction(params.transactionId, params.sourceId);

      // delete transaction from source and all other places
      await Transaction.deleteFromSource(params.transactionId, params.sourceId);

      res.json({ message: "Transaction deleted" });

    } else if (params.containerId) {

      // check if requester has access to container
      const userContainerId = await Container.checkUserContainer(req.user.id, params.containerId);

      // get the source of the transaction
      const sourceId = await Transaction.getTransactionSource(params.transactionId)
 
      // check if source is in container
      const sourceContainerId = await Container.checkSourceContainer(sourceId, params.containerId);

      // check if user has access to the source of this transaction in this container
      await Container.checkUserSourceContainer(userContainerId, sourceContainerId)

      // delete transaction from source and all other places
      await Transaction.deleteFromContainer(params.transactionId);

      res.json({ message: "Transaction deleted" });
    }
   
  } catch (err) {
    console.log(err)
    res.status(err.status || 400).json(err);
  }
});