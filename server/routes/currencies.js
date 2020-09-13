const express = require("express");
const router = express.Router();
const Currency = require("../models/currency");
const auth = require("../middleware/auth");
const currenciesSchema = require("./schemas/currenciesSchema");

router.get("/", async (req, res) => {
  try {
    const currencies = await Currency.readAll();

    await currenciesSchema.getCurrenciesOutput.validateAsync(currencies);
    res.json(currencies);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.get("/:currencyId", async (req, res) => {
  try {
    const currency = await Currency.readById(req.params.currencyId);

    await currenciesSchema.getCurrencyIdOutput.validateAsync(currency);
    res.json(currency);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

module.exports = router;
