const express = require("express");
const router = express.Router();
const sourceSchemas = require('./schemas/sourceSchemas');
const Transaction = require('../models/transaction');

module.exports = router;

router.post('/', async (req, res) => {
  try {
    const transaction = Transaction.create(req.body, req.user)
    
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});