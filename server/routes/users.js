const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.get("/userId/:userId", auth, async (req, res) => {
  try {
    const user = await User.readById(req.params.userId);

    if (!user) throw { message: "User doesn't exist" };
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/username/:username", auth, async (req, res) => {
  try {
    const user = await User.readByUsername(req.params.username);

    if (!user) throw { message: "User doesn't exist" };
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
