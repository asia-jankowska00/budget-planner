const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authSchema = require("./schemas/authSchema");

router.post("/register", async (req, res) => {
  try {
    authSchema.registerInput.validate(req.body);

    // check if user exists
    await User.canCreateUser(req.body.username);

    // if not, create user
    const newUser = await User.create(req.body);
    if (!newUser) {
      return res.status(400).json({ message: "Failed to create user" });
    }

    const token = jwt.sign(
      JSON.stringify({ username: newUser.username, id: newUser.id }),
      process.env.JWT_SECRET
    );
    newUser.token = token;

    authSchema.registerOutput.validate(newUser);
    res.json(newUser);
  } catch (err) {
    // if exists, throw an error
    res.status(409).json(err);
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
