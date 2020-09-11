const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/userId/:userId", async (req, res) => {
  try {
    const user = await User.readById(req.params.userId);

    if (!user) throw { message: "User doesn't exist" };
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/username/:username", async (req, res) => {
  try {
    const user = await User.readByUsername(req.params.username);

    if (!user) throw { message: "User doesn't exist" };
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
