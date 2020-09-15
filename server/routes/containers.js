const express = require("express");
const router = express.Router();
const Container = require("../models/container");
const containerSchemas = require("./schemas/containerSchemas");

router.post("/", async (req, res) => {
  const newContainer = await Container.create(req.body, req.user);
  res.status(201).json(newContainer);
});

router.get("/", async (req, res) => {});

router.get("/:containerId", async (req, res) => {});

router.patch("/:containerId", async (req, res) => {});

router.delete("/:containerId", async (req, res) => {});

module.exports = router;
