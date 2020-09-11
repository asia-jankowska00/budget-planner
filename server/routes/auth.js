const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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

    const token = jwt.sign(
      JSON.stringify({ username: newUser.username, id: newUser.id }),
      process.env.JWT_SECRET
    );

    newUser.token = token;

    res.json(newUser);
  }
});

router.post("/login", async (req, res) => {
  try {
    const matchPassword = await User.matchPassword(req.body);

    if (matchPassword) {
      const user = await User.readByUsername(req.body.username);

      const token = jwt.sign(
        JSON.stringify({ username: user.username, id: user.id }),
        process.env.JWT_SECRET
      );

      user.token = token;

      res.json(user);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
