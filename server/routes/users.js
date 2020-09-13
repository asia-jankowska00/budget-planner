const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const userSchemas = require("./schemas/userSchemas");

router.get("", auth, async (req, res) => {
  try {
    const users = await User.search(req.query.q);

    if (!users) throw { message: "Failed to find user" };

    await userSchemas.searchUsersOutput.validateAsync(users);
    res.json(users);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

module.exports = router;
