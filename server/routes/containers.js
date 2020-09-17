const express = require("express");
const router = express.Router();
const Container = require("../models/container");
const Source = require("../models/source");
const containerSchemas = require("./schemas/containerSchemas");

router.post("/", async (req, res) => {
  try {
    const newContainer = await Container.create(req.body, req.user);

    // const sourcesPromises = newContainer.sources.map((sourceId) => {
    //   return Source.readById(sourceId, req.user);
    // });

    // Promise.all(sourcesPromises).then((values) => {
    //   newContainer.sources = values;
    //   console.log(newContainer);

    res.status(201).json(newContainer);
    // });
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const containers = await Container.readAll(req.user);
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
    res.json(container);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.patch("/:containerId", async (req, res) => {
  try {
    const container = await Container.readById(req.params.containerId);
    console.log(container);
    await container.update(req.body, req.user);

    res.json(container);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.delete("/:containerId", async (req, res) => {
  try {
    const container = await Container.delete(req.params.containerId, req.user);
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
