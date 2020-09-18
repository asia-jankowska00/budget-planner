const express = require("express");
const Source = require("../models/source");
const User = require("../models/user");
const Currency = require("../models/currency");
const router = express.Router();

const sourceSchemas = require("./schemas/sourceSchemas");

router.post("/", async (req, res) => {
  try {
    // get the user from middleware (req.user)
    await sourceSchemas.postSourcesInput.validateAsync(req.body);

    const owner = await User.readById(userObj.id);

    // if everything is fine, procceed create
    const newSource = await Source.create(req.body, owner);

    await sourceSchemas.defaultSourceOutput.validateAsync(newSource);

    res.status(201).json(newSource);
  } catch (err) {
    // if exists, throw an error
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const owner = await User.readById(req.user.id);
    console.log(owner);

    const sources = await Source.readAllOwner(owner);

    // sources.forEach((source) => (source.owner = owner));

    await sourceSchemas.getSourcesOutput.validateAsync(sources);
    console.log(sources);
    res.json(sources);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.get("/:sourceId", async (req, res) => {
  try {
    const owner = await User.readById(userObj.id);

    const source = await Source.readById(req.params.sourceId, owner);

    let currency;
    // check if currency exists
    if (req.body.currencyId) {
      currency = await Currency.readById(req.body.currencyId);
      source.currency = currency;
    }

    source.owner = owner;

    await sourceSchemas.defaultSourceOutput.validateAsync(source);

    res.json(source);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.patch("/:sourceId", async (req, res) => {
  try {
    await sourceSchemas.patchSourceInput.validateAsync(req.body);

    if (req.body.currencyId) {
      await Currency.readById(req.body.currencyId);
    }

    const source = await Source.readById(req.params.sourceId, req.user);
    await source.update(req.body, req.user);

    await sourceSchemas.defaultSourceOutput.validateAsync(source);

    res.json(source);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.delete("/:sourceId", async (req, res) => {
  try {
    await Source.delete(req.params.sourceId, req.user);
    res.json({ message: "Source deleted" });
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

module.exports = router;
