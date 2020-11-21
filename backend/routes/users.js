const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const authStates = require('../public/constants/auth-states');
const regexPatterns = require('../public/constants/regex-patterns');
const { validateByRegex } = require('../helpers/helperFunctions');
var mandrill = require('mandrill-api');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL);

// Load User model
const User = require('../models/User');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const moment = require('moment');

function validateText(text, regexPattern) {
  return regexPattern.test(String(text).toLowerCase());
}

function isErrorObjectEmpty(obj) {
  for (var key in obj) {
    if (obj[key] !== null && obj[key] != '') return false;
  }
  return true;
}

// Register Page
router.get('/register', ensureGuest, (req, res) =>
  res.render('register', {
    layout: 'login',
    errors: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password2: '',
    },
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
  })
);

// @desc Show reset password page
// @route GET /reset/:id
router.get('/reset/:id', ensureGuest, async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await User.findOne({
        resetToken: new mongoose.Types.ObjectId(req.params.id),
      }).lean();

      if (!user) {
        console.log('User not found');
        return res.redirect('/');
      }

      if (moment(user.resetTimeout).isBefore(moment())) {
        console.log('Retry link has timed out');
        res.redirect('/');
      } else {
        res.render('reset', {
          layout: 'login',
          user,
        });
      }
    } else {
      console.log('Retry link has invalid token id');
      return res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

//MAKE FORGOT POST WORK
router.post('/forgot', ensureGuest, async (req, res) => {
  const { email } = req.body;
  if (!validateByRegex(email, regexPatterns.EMAIL_VALIDATION)) {
    return res.json({
      authState: authStates.GUsEST,
      user: {},
      error: 'You have entered an invalid email or password',
    });
  }

  let resetToken = new mongoose.Types.ObjectId();
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    console.error('User does not exist');
    return res.json({
      authState: authStates.GUEST,
      user: {},
      error: 'You have entered an invalid email or password',
    });
  } else {
    user.set({
      resetToken: resetToken,
      resetTimeout: moment().add(1, 'hours'),
    });
    user.save();
    let link = 'http://localhost:8000/reset/' + resetToken;
    let text =
      "We've recieved a password change request for your Storybooks account. </p><p> If you did not ask to change your password, then you can ignore this email and your password will not be changed. The link below will remain active for 1 hour.";
    var message = {
      html:
        '<p>' +
        text +
        '</p>' +
        '<a href="' +
        link +
        '" > Reset your password here </a>',
      text: text.replace('</p><p> ', '') + ' ' + link,
      subject: 'Storybooks password change request',
      from_email: 'me@kassmanben.com',
      from_name: 'Storybooks',
      to: [
        {
          email: user.email,
          name: user.displayName,
          type: 'to',
        },
      ],
    };
    var async = false;
    var ip_pool = 'Main Pool';
    mandrill_client.messages.send(
      {
        message: message,
        async: async,
        ip_pool: ip_pool,
      },
      function (result) {
        console.log(result);
      },
      function (err) {
        console.log(
          'A mandrill error occurred: ' + err.name + ' - ' + err.message
        );
      }
    );
    return res.json({
      authState: authStates.GUEST,
      user: {},
      error: 'You have entered an invalid email or password',
    });
  }
});

// Register
router.post('/reset/:id', async (req, res) => {
  const { password, password2 } = req.body;

  let errors = {
    password:
      password && validateText(password, regexPatterns.PASSWORD_VALIDATION)
        ? ''
        : 'Your password must include one lowercase letter, a number and special character',
    password2:
      password && validateText(password, regexPatterns.PASSWORD_VALIDATION)
        ? ''
        : 'Your passwords must match',
  };

  if (isErrorObjectEmpty(errors) && password === password2) {
    const user = await User.findOne({
      _id: req.params.id,
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        res.render(`/reset/${req.params.id}`, {
          layout: 'login',
          errors,
          password: '',
          password2: '',
        });
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          res.render(`/reset/${req.params.id}`, {
            layout: 'login',
            errors,
            password: '',
            password2: '',
          });
        }
        user.password = hash;
        user
          .save()
          .then(() => {
            res.redirect('/');
          })
          .catch((err) => {
            console.log(err);
            res.render(`/reset/${req.params.id}`, {
              layout: 'login',
              errors,
              password: '',
              password2: '',
            });
          });
      });
    });
  } else {
    const user = await User.findOne({
      resetToken: new mongoose.Types.ObjectId(req.params.id),
    }).lean();
    res.render(`/reset/${req.params.id}`, {
      layout: 'login',
      errors,
      user,
    });
  }
});

// Register
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;
  let errors = {
    firstName: !firstName
      ? 'Please enter your first name'
      : validateText(firstName, regexPatterns.NAME_VALIDATION)
      ? ''
      : "Your name must contain only letters and valid special characters (,.'-)",
    lastName: !lastName
      ? 'Please enter your last name'
      : validateText(lastName, regexPatterns.NAME_VALIDATION)
      ? ''
      : "Your name must contain only letters and valid special characters (,.'-)",
    email:
      email && validateText(email, regexPatterns.EMAIL_VALIDATION)
        ? ''
        : 'Please enter a valid email address',
    password:
      password && validateText(password, regexPatterns.PASSWORD_VALIDATION)
        ? ''
        : 'Your password must include one lowercase letter, a number and special character',
    password2:
      password2 && validateText(password2, regexPatterns.PASSWORD_VALIDATION)
        ? ''
        : 'Your passwords must match',
  };

  if (isErrorObjectEmpty(errors)) {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        res.render('register', {
          layout: 'login',
          errors,
          firstName,
          lastName,
          email,
          password: '',
          password2: '',
        });
      } else {
        const newUser = new User({
          userId: mongoose.Types.ObjectId(),
          profileType: 'local',
          displayName: firstName + ' ' + lastName,
          firstName,
          lastName,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            res.render('register', {
              layout: 'login',
              errors,
              firstName,
              lastName,
              email,
              password: '',
              password2: '',
            });
          }
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              res.render('register', {
                layout: 'login',
                errors,
                firstName,
                lastName,
                email,
                password: '',
                password2: '',
              });
            }
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                res.redirect('/');
              })
              .catch((err) => {
                if (err) {
                  res.render('register', {
                    layout: 'login',
                    errors,
                    firstName,
                    lastName,
                    email,
                    password: '',
                    password2: '',
                  });
                }
              });
          });
        });
      }
    });
  } else {
    res.render('register', {
      layout: 'login',
      errors,
      firstName,
      lastName,
      email,
      password: '',
      password2: '',
    });
  }
});

// Edit
router.put('/edit', ensureAuth, async (req, res) => {
  const { firstName, lastName, email } = req.body;
  let errors = {
    firstName: !firstName
      ? 'Please enter your first name'
      : validateText(firstName, regexPatterns.NAME_VALIDATION)
      ? ''
      : "Your name must contain only letters and valid special characters (,.'-)",
    lastName: !lastName
      ? 'Please enter your last name'
      : validateText(lastName, regexPatterns.NAME_VALIDATION)
      ? ''
      : "Your name must contain only letters and valid special characters (,.'-)",
    email:
      email && validateText(email, regexPatterns.EMAIL_VALIDATION)
        ? ''
        : 'Please enter a valid email address',
  };

  if (isErrorObjectEmpty(errors)) {
    let user = await User.findOne({ email: email }).lean();
    if (!user) {
      res.redirect('/profile');
    }

    if (user._id != req.user.id) {
      res.redirect('/profile');
    } else {
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          displayName: firstName + ' ' + lastName,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      console.log('User Updated');
      res.redirect('/profile');
    }
  } else {
    res.redirect('/profile');
  }
});

// Login
router.post('/login', ensureGuest, (req, res, next) => {
  passport.authenticate('local', function (err, user) {
    if (err) {
      console.log('TOP LEVEL ERR:', err);
      return res.json({
        authState: authStates.GUEST,
        user: {},
        error: 'You have entered an invalid email or password',
      });
    }
    if (!user) {
      return res.json({
        authState: authStates.GUEST,
        user: {},
        error: 'You have entered an invalid email or password',
      });
    }

    req.logIn(user, function (err) {
      if (err) {
        console.log('ERRORHEREMAYBE??');
        return next(err);
      }
      return res.json({ authState: authStates.LOGGEDIN, user });
    });
  })(req, res, next);
});

module.exports = router;
