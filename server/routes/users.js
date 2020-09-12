const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.search(req.query);

    if (!user) throw { message: "Failed to find user" };

    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
