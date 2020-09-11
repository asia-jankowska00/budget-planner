const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.readByUsername(req.body.username);
    if (userExists) {
      res.status(400).json({ message: "Username taken" });
    }
  } catch (err) {
    const newUser = await User.create(req.body);
    if (!newUser) {
      res.status(400).json({ message: "Failed to create user" });
    }

    res.json(newUser);
  }
});

router.post("/login", async (req, res) => {
  try {
    const matchPassword = await User.matchPassword(req.body);

    if (matchPassword) {
      const user = await User.readByUsername(req.body.username);
      res.json(user);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
