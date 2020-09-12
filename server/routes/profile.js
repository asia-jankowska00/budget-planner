const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const profileSchema = require("./schemas/profileSchema");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.readById(req.user.id);

    if (!user) throw { message: "User doesn't exist" };
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.patch("/", auth, async (req, res) => {
  // update user from JWT
  try {
    const { error: inputError } = profileSchema.patchProfileInput.validate(
      req.body
    );
    if (inputError) throw inputError;

    const userToUpdate = await User.readById(req.user.id);
    await userToUpdate.update(req.body);
    const updatedUser = await User.readById(req.user.id);

    const { error: outputError } = profileSchema.patchProfileInput.validate(
      req.body
    );
    if (outputError) throw outputError;

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/", auth, async (req, res) => {
  // set user from JWT isDisabled to true
  try {
    console.log(req);
    const user = await User.delete(req.user.id);

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
