const express = require("express");
const router = express.Router();
const Container = require("../models/container");
const Source = require("../models/source");
const User = require("../models/user");
// const Currency = require("../models/currency");
const containerSchemas = require("./schemas/containerSchemas");

router.post("/", async (req, res) => {
  try {
    await containerSchemas.postContainersInput.validateAsync(req.body);
    // const get whole owner obejct from current user
    const owner = await User.readById(req.user.id);

    // check if the sources from req exist and are owned by current user
    const sources = await Promise.all(
      req.body.sources.map((sourceId) => Source.readById(sourceId, owner))
    );

    //create new container and get its name and id
    const newContainer = await Container.create(req.body, owner);

    // bind the sources to the container
    await Promise.all(
      req.body.sources.map((sourceId) =>
        Container.insertContainerSource(newContainer.id, sourceId)
      )
    );

    // attach owner and sources to newContainer
    newContainer.owner = owner;
    newContainer.sources = sources;

    // validate with Joi the newContainer
    await containerSchemas.postContainersOutput.validateAsync(newContainer);
    res.status(201).json(newContainer);
    // });
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const containers = await Container.readAll(req.user);

    await containerSchemas.getContainersOutput.validateAsync(containers);
    res.json(containers);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.get("/:containerId", async (req, res) => {
  try {
    const container = await Container.readById(
      req.params.containerId,
      req.user
    );
    const owner = await User.readById(req.user.id);

    const sources = await Promise.all(
      container.sources.map((sourceId) => Source.readById(sourceId, owner))
    );

    container.owner = owner;
    container.sources = sources;

    await containerSchemas.getContainerIdOutput.validateAsync(container);
    res.json(container);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.patch("/:containerId", async (req, res) => {
  try {
    await containerSchemas.patchContainerInput.validateAsync(req.body);

    const owner = await User.readById(req.user.id);

    const container = await Container.readById(req.params.containerId, owner);
    await container.update(req.body, owner);

    const sources = await Promise.all(
      container.sources.map((sourceId) => Source.readById(sourceId, owner))
    );

    container.sources = sources;
    container.owner = owner;

    await containerSchemas.patchContainerOutput.validateAsync(container);
    res.json(container);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.delete("/:containerId", async (req, res) => {
  try {
    await Container.delete(req.params.containerId, req.user);
    res.json({ message: "Container deleted" });
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.post("/:containerId/sources", async (req, res) => {
  try {
    const container = await Container.readById(
      req.params.containerId,
      req.user
    );
    console.log(container);

    const containerWithNewSource = await container.addSource(
      req.body.sourceId,
      req.user
    );

    res.json(containerWithNewSource);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

module.exports = router;
