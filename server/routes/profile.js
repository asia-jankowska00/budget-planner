const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Currency = require("../models/currency");
const auth = require("../middleware/auth");
const profileSchemas = require("./schemas/profileSchemas");

router.get("/", auth, async (req, res) => {
  // get user from JWT
  try {
    const user = await User.readById(req.user.id);

    await profileSchemas.defaultProfileOutput.validateAsync(user);
    res.json(user);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.patch("/", auth, async (req, res) => {
  // update user from JWT
  try {
    await profileSchemas.patchProfileInput.validateAsync(req.body);

    const user = await User.readById(req.user.id);
    //usernames should be unique
    if (req.body.username !== user.username) {
      await User.canCreateUser(req.body.username)
    }

    let currency;

    // get the new currency if needed
    if (user.currency.id !== req.body.currency) {
      currency = await Currency.readById(req.body.currency);
    }

    await user.update(req.body, currency);

    await profileSchemas.defaultProfileOutput.validateAsync(user);

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(err.status || 400).json(err);
  }
});

router.delete("/", auth, async (req, res) => {
  // set user from JWT isDisabled to true
  try {
    // check if user exists
    await User.readById(req.user.id);

    await User.delete(req.user.id);

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

module.exports = router;
