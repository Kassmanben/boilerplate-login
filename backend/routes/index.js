const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const authStates = require('../public/constants/auth-states');
const Story = require('../models/Story');

// @desc Set authState
// @route GET /
router.get('/authState', ensureGuest, (req, res) => {
  res.status(200).json({ user: {}, authState: authStates.GUEST });
});

// @desc profile
// @route GET /profile
router.get('/profile', ensureAuth, async (req, res) => {
  try {
    // lean means it's returned as a plain js object, not mongoose
    const stories = await Story.find({
      user: req.user.id,
    })
      .populate('user')
      .lean();

    res.render('profile', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;
