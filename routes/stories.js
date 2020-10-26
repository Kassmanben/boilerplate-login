const express = require("express");
const router = express.Router();
const constants = require("../public/constants/constants");
const { ensureAuth } = require("../middleware/auth");

const Story = require("../models/Story");

// @desc Show add page
// @route GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc Show all stories
// @route GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
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

// @desc Show user stories
// @route GET /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
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

// @desc Show single story
// @route GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      req.session.sessionFlash = {
        type: "alert-danger",
        message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.NOT_FOUND,
      };
      console.error(err);
      res.redirect("/");
    }

    res.render("stories/show", {
      story,
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

// @desc Show edit page
// @route GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      req.session.sessionFlash = {
        type: "alert-danger",
        message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.NOT_FOUND,
      };
      console.error(err);
      res.redirect("/");
    }

    if (story.user != req.user.id) {
      console.log("User does not match story user");
      res.redirect("/stories");
    } else {
      res.render("stories/edit", { story });
    }
  } catch (err) {
    req.session.sessionFlash = {
      type: "alert-danger",
      message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.GENERIC_ERROR,
    };
    console.error(err);
    res.redirect("/");
  }
});

// @desc Process add form
// @route POST /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    req.session.sessionFlash = {
      type: "alert-success",
      message: constants.FLASH_MESSAGES.REDIRECT_SUCCESSES.STORY_ADDED_SUCCESS,
    };
    res.redirect("/dashboard");
  } catch (err) {
    req.session.sessionFlash = {
      type: "alert-danger",
      message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.GENERIC_ERROR,
    };
    console.error(err);
    res.redirect("/");
  }
});

// @desc Update story
// @route PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      req.session.sessionFlash = {
        type: "alert-danger",
        message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.NOT_FOUND,
      };
      console.error(err);
      res.redirect("/");
    }

    if (story.user != req.user.id) {
      console.log("User does not match story user");
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      req.session.sessionFlash = {
        type: "alert-success",
        message:
          constants.FLASH_MESSAGES.REDIRECT_SUCCESSES.STORY_EDITED_SUCCESS,
      };

      res.redirect("/dashboard");
    }
  } catch (err) {
    req.session.sessionFlash = {
      type: "alert-danger",
      message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.GENERIC_ERROR,
    };
    console.error(err);
    res.redirect("/");
  }
});

// @desc Delete story
// @route DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      req.session.sessionFlash = {
        type: "alert-danger",
        message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.NOT_FOUND,
      };
      console.error(err);
      res.redirect("/");
    }

    if (story.user != req.user.id) {
      console.log("User does not match story user");
      res.redirect("/stories");
    } else {
      await Story.remove({ _id: req.params.id });
      req.session.sessionFlash = {
        type: "alert-success",
        message:
          constants.FLASH_MESSAGES.REDIRECT_SUCCESSES.STORY_DELETED_SUCCESS,
      };
      res.redirect("/dashboard");
    }
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
