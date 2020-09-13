const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const profileSchema = require("./schemas/profileSchema");

router.get("/", auth, async (req, res) => {
  // get user from JWT
  try {
    console.log(req.user.id);
    const user = await User.readById(req.user.id);

    await profileSchema.getProfileOutput.validateAsync(user);
    res.json(user);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.patch("/", auth, async (req, res) => {
  // update user from JWT
  try {
    await profileSchema.patchProfileInput.validateAsync(req.body);

    const user = await User.readById(req.user.id);
    await user.update(req.body);

    await profileSchema.patchProfileOutput.validateAsync(user);

    res.json(user);
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

router.delete("/", auth, async (req, res) => {
  // set user from JWT isDisabled to true
  try {
    await User.delete(req.user.id);

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(err.status || 400).json(err);
  }
});

module.exports = router;
