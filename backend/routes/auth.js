const express = require('express');
const passport = require('passport');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');

// @desc Authenticate with Google
// @route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc Google Auth callback
// @route GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    return res.redirect('/');
  }
);

// @desc Logout user
// @route GET /auth/logout
router.get('/logout', ensureAuth, (req, res) => {
  req.logout();
  console.log('Logging user out');
  res.status(200).json({ redirect: '/login', user: {} });
});

module.exports = router;
