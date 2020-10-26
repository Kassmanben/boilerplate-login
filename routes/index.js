const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Story = require("../models/Story");

// @desc Login/Landing page
// @route GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login", { layout: "login" });
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
