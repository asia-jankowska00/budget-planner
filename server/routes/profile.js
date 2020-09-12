const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

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
  const userToUpdate = User.readById(req.user.id);

  userToUpdate.update(req.body);
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
