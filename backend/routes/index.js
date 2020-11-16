const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const constants = require("../public/constants/constants");
const Story = require("../models/Story");

// @desc Set authState
// @route GET /
router.get("/authState", ensureGuest, (req, res) => {
  res
    .status(200)
    .json({ redirect: "/", user: {}, authState: constants.AUTHSTATES.GUEST });
});

// @desc profile
// @route GET /profile
router.get("/profile", ensureAuth, async (req, res) => {
  try {
    // lean means it's returned as a plain js object, not mongoose
    const stories = await Story.find({
      user: req.user.id,
    })
      .populate("user")
      .lean();

    res.render("profile", {
      stories,
    });
  } catch (err) {
    req.session.sessionFlash = {
      type: "alert-danger",
      message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.GENERIC_ERROR,
    };
    console.error(err);
    res.redirect("/");
  }
});

module.exports = router;
