const express = require("express");
const router = express.Router({ mergeParams: true });
const Category = require("../models/category");
const Container = require("../models/container");
const categorySchemas = require("./schemas/categorySchemas");

router.post("/", async (req, res) => {
  try {
    await categorySchemas.postInputCategory.validateAsync(req.body);

    await Container.checkOwner(req.params.containerId, req.user.id);

    const newCategory = await Category.create(req.params.containerId, req.body);

    await categorySchemas.defaultOutputCategory.validateAsync(newCategory);
    res.status(201).json(newCategory);
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Category.readAll(req.params.containerId);

    await categorySchemas.getCategoriesOutput.validateAsync(categories);
    res.json(categories);
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

router.get("/:categoryId", async (req, res) => {
  try {
    const category = await Category.readById(
      req.params.containerId,
      req.params.categoryId
    );

    await categorySchemas.defaultOutputCategory.validateAsync(category);

    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

router.patch("/:categoryId", async (req, res) => {
  try {
    await categorySchemas.patchInputCategory.validateAsync(req.body);

    await Container.checkOwner(req.params.containerId, req.user.id);

    const category = await Category.readById(
      req.params.containerId,
      req.params.categoryId
    );
    await category.update(req.body);

    await categorySchemas.defaultOutputCategory.validateAsync(category);
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

router.delete("/:categoryId", async (req, res) => {
  try {
    await Container.checkOwner(req.params.containerId, req.user.id);

    await Category.delete(req.params.containerId, req.params.categoryId);
    res.json("Category deleted");
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

module.exports = router;
