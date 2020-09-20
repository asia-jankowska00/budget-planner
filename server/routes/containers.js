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
    const requester = await User.readById(req.user.id);

    // check if the sources from req exist and are owned by current user
    const sources = await Promise.all(
      req.body.sources.map((sourceId) => Source.readById(sourceId, requester))
    );

    //create new container and get its name and id
    const newContainer = await Container.create(req.body, requester);

    // bind the sources to the container
    await Promise.all(
      req.body.sources.map((sourceId) =>
        Container.insertSourceContainer(sourceId, newContainer.id, requester.id)
      )
    );

    // attach owner and sources to newContainer
    newContainer.owner = requester;
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
    // fetch all containers where user is owner OR has access
    const containers = await Container.readAll(req.user);

    // fetch owner of each container
    const owners = await Promise.all(
      containers.map((container) => User.readById(container.owner.id))
    );

    // append owner to respective container
    containers.forEach((container, index) => (container.owner = owners[index]));

    await containerSchemas.getContainersOutput.validateAsync(containers);
    res.json(containers);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.get("/:containerId", async (req, res) => {
  try {
    // check if user has access to this container
    await Container.checkUserContainer(req.user.id, req.params.containerId);

    // fetch container
    const container = await Container.readById(req.params.containerId);

    // fetch user to get their preffered currency
    const requester = await User.readById(req.user.id);

    // fetch all sources
    const sources = await Promise.all(
      container.sources.map((sourceId) => Source.readById(sourceId, requester))
    );

    // fetch container owner
    const owner = await User.readById(container.owner.id);

    // append sources and owner to container
    container.sources = sources;
    container.owner = owner;

    await containerSchemas.getContainerIdOutput.validateAsync(container);
    res.json(container);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.patch("/:containerId", async (req, res) => {
  try {
    await containerSchemas.patchContainerInput.validateAsync(req.body);

    // check if requester is owner of the container
    await Container.checkOwner(req.params.containerId, req.user.id);

    // fetch requester info
    const requester = await User.readById(req.user.id);

    // fetch container info
    const container = await Container.readById(
      req.params.containerId,
      requester
    );

    // update container instance
    await container.update(req.body, requester);
    console.log(container);

    // fetch sources
    const sources = await Promise.all(
      container.sources.map((sourceId) => Source.readById(sourceId, requester))
    );

    // append source and owner
    container.sources = sources;
    container.owner = requester;

    await containerSchemas.patchContainerOutput.validateAsync(container);
    res.json(container);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.delete("/:containerId", async (req, res) => {
  try {
    // check if requester is owner of the container
    await Container.checkOwner(req.params.containerId, req.user.id);

    // delete container
    await Container.delete(req.params.containerId);

    res.json({ message: "Container deleted" });
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.post("/:containerId/collaborators", async (req, res) => {
  // add new collaborator to container
  try {
    // fetch requester info
    const requester = await User.readById(req.user.id);

    // fetch container
    const container = await Container.readById(
      req.params.containerId,
      requester
    );
    console.log(container);

    //check if requester is the owner of the container
    await Container.checkOwner(container, requester);

    // check if new collaborator exists
    const newCollaborator = await User.readById(req.body.collaboratorId);

    // add new collaborator to container
    const containerWithNewCollaborator = await container.addCollaborator(
      newCollaborator
    );

    res.json(containerWithNewCollaborator);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.get("/:containerId/collaborators", async (req, res) => {
  // get all sources bound to a container
  try {
    // fetch requester info
    const requester = await User.readById(req.user.id);

    // fetch container
    const container = await Container.readById(
      req.params.containerId,
      requester
    );
    console.log(container);

    // check if requester is in container

    // get all sources bound to a container
    const containerCollaborators = await container.getCollaborators();

    res.json(containerCollaborators);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.delete(
  "/:containerId/collaborators/:collaboratorId",
  async (req, res) => {
    // get all sources bound to a container
    try {
      // fetch requester info
      const requester = await User.readById(req.user.id);

      // fetch container
      const container = await Container.readById(
        req.params.containerId,
        requester
      );
      console.log(container);

      // check if requester is container owner

      // fetch collaborator to delete
      const collaboratorToDelete = await User.readById(
        req.params.collaboratorId
      );

      // check if collaborator is in containe

      // delete collaborator from container and all their permissions
      await container.deleteCollaborator(collaboratorToDelete);

      res.json(containerSources);
    } catch (err) {
      res.status(err.status || 400).json(err);
    }
  }
);

router.post("/:containerId/sources", async (req, res) => {
  // bind new source to container
  try {
    // fetch requester info
    const requester = await User.readById(req.user.id);

    // fetch container
    const container = await Container.readById(
      req.params.containerId,
      requester
    );
    console.log(container);

    //check if requester is in the container

    // add new source to container
    const containerWithNewSource = await container.addSource(
      req.body.sourceId,
      requester
    );

    res.json(containerWithNewSource);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.get("/:containerId/sources", async (req, res) => {
  // get all sources bound to a container
  try {
    // fetch requester info
    const requester = await User.readById(req.user.id);

    // fetch container
    const container = await Container.readById(
      req.params.containerId,
      requester
    );
    console.log(container);

    // check if requester is in container

    // get all sources bound to a container
    const containerSources = await container.getSources(requester);

    res.json(containerSources);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.delete("/:containerId/sources/:sourceId", async (req, res) => {
  // get all sources bound to a container
  try {
    // fetch requester info
    const requester = await User.readById(req.user.id);

    // fetch source to delete
    const sourceToDelete = await Source.readById(
      req.params.sourceId,
      requester
    );

    // check if requester is source owner

    // fetch container
    const container = await Container.readById(
      req.params.containerId,
      requester
    );
    console.log(container);

    // check if requester is in container

    // check if source is in container

    // delete source from container and all permissions related to the source
    await container.deleteSource(req.params.sourceId, requester);

    res.json(containerSources);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

module.exports = router;
