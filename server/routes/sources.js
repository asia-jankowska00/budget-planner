const express = require("express");
const Source = require("../models/source");
const User = require("../models/user");
const Currency = require("../models/currency");
const router = express.Router();

const sourceSchemas = require("./schemas/sourceSchemas");

router.post("/", async (req, res) => {
  try {
    await sourceSchemas.postSourcesInput.validateAsync(req.body);

    // fetch requester info
    const requester = await User.readById(req.user.id);

    // create new source
    const newSource = await Source.create(req.body, requester);

    await sourceSchemas.defaultSourceOutput.validateAsync(newSource);
    res.status(201).json(newSource);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    // fetch requester info
    const requester = await User.readById(req.user.id);

    // get all sources where requester is owner
    const sources = await Source.readAllOwner(requester);

    await sourceSchemas.getSourcesOutput.validateAsync(sources);
    res.json(sources);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.get("/:sourceId", async (req, res) => {
  try {
    // check if requester is owner
    await Source.checkOwner(req.params.sourceId, req.user);

    // fetch requester info
    const requester = await User.readById(req.user.id);

    // fetch source info
    const source = await Source.readById(req.params.sourceId, requester);

    source.owner = requester;

    await sourceSchemas.defaultSourceOutput.validateAsync(source);
    res.json(source);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.patch("/:sourceId", async (req, res) => {
  try {
    await sourceSchemas.patchSourceInput.validateAsync(req.body);

    // check if requester is source owner
    await Source.checkOwner(req.params.sourceId, req.user);

    if (req.body.currencyId) {
      // check if currency exists
      await Currency.readById(req.body.currencyId);
    }

    // fetch requester info
    const requester = await User.readById(req.user.id);

    // fetch source info
    const source = await Source.readById(req.params.sourceId, requester);

    // update source
    await source.update(req.body, requester);

    await sourceSchemas.defaultSourceOutput.validateAsync(source);
    res.json(source);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.delete("/:sourceId", async (req, res) => {
  try {
    // fetch requester info
    const requester = await User.readById(req.user.id);

    // check if requester is source owner
    await Source.checkOwner(req.params.sourceId, requester);

    // delete source
    await Source.delete(req.params.sourceId);
    res.json({ message: "Source deleted" });
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

module.exports = router;
