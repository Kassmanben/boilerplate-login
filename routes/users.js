const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
// Load User model
const User = require('../models/User');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// Register Page
router.get('/register', ensureGuest, (req, res) => res.render('register', {
  layout: 'register',
  errors: [],
  name: '',
  email: '',
  password: '',
  password2: ''
}));

// Register
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          firstName,
          lastName,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          userId: mongoose.Types.ObjectId(),
          profileType: 'local',
          displayName: firstName + " " + lastName,
          firstName,
          lastName,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.redirect('/');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  })(req, res, next);
});

module.exports = router;