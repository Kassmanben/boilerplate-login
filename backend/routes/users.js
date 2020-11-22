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
        return res.json({
          authState: authStates.GUEST,
          user: {},
          errorMessage: 'Invalid reset URL',
        });
      }

      if (moment(user.resetTimeout).isBefore(moment())) {
        console.log('Retry link has timed out');
        return res.json({
          authState: authStates.GUEST,
          user: {},
          errorMessage: 'Reset URL has timed out',
        });
      } else {
        res.json({
          authState: authStates.GUEST,
          user: {},
        });
      }
    } else {
      console.log('Retry link has invalid token id');
      return res.json({
        authState: authStates.GUEST,
        user: {},
        errorMessage: 'Invalid reset URL',
      });
    }
  } catch (err) {
    console.error(err);
    return res.json({
      authState: authStates.GUEST,
      user: {},
      errorMessage: 'Invalid reset URL',
    });
  }
});

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
      errorMessage: 'You have entered an invalid email or password',
    });
  }
});

// Register
router.post('/reset/:id', async (req, res) => {
  const { password, password2 } = req.body;

  if (
    password &&
    validateText(password, regexPatterns.PASSWORD_VALIDATION) &&
    password2 &&
    validateText(password2, regexPatterns.PASSWORD_VALIDATION) &&
    password === password2
  ) {
    const user = await User.findOne({
      resetToken: new mongoose.Types.ObjectId(req.params.id),
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        res.json({
          authState: authStates.GUEST,
          user: {},
          errorMessage: 'Sorry, something went wrong. Please try again',
        });
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          res.json({
            authState: authStates.GUEST,
            user: {},
            errorMessage: 'Sorry, something went wrong. Please try again',
          });
        }
        user.set({ password: hash });
        user.resetTimeout = undefined;
        user.resetToken = undefined;
        user
          .save()
          .then(() => {
            res.json({
              authState: authStates.GUEST,
              user: {},
              successMessage: 'Your password has been reset!',
            });
          })
          .catch((err) => {
            console.log(err);
            res.json({
              authState: authStates.GUEST,
              user: {},
              errorMessage: 'Sorry, something went wrong. Please try again',
            });
          });
      });
    });
  } else {
    res.json({
      authState: authStates.GUEST,
      user: {},
      errorMessage: 'Sorry, something went wrong. Please try again',
    });
  }
});

// Register
router.post('/register', (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;
  if (
    firstName &&
    lastName &&
    email &&
    password &&
    password2 &&
    validateText(firstName, regexPatterns.NAME_VALIDATION) &&
    validateText(lastName, regexPatterns.NAME_VALIDATION) &&
    validateText(email, regexPatterns.EMAIL_VALIDATION) &&
    validateText(password, regexPatterns.PASSWORD_VALIDATION) &&
    validateText(password2, regexPatterns.PASSWORD_VALIDATION)
  ) {
    User.findOne({ email: email.toLowerCase() }).then((user) => {
      if (user) {
        return res.json({
          authState: authStates.GUEST,
          user: {},
          errorMessage:
            'Something went wrong. An account with this email may already exist',
        });
      } else {
        const newUser = new User({
          userId: mongoose.Types.ObjectId(),
          profileType: 'local',
          displayName: firstName + ' ' + lastName,
          firstName,
          lastName,
          email: email.toLowerCase(),
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            console.log(err);
            res.json({
              authState: authStates.GUEST,
              user: {},
              errorMessage:
                'Something went wrong. An account with this email may already exist',
            });
          }
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              res.json({
                authState: authStates.GUEST,
                user: {},
                errorMessage:
                  'Something went wrong. An account with this email may already exist',
              });
            }
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                console.log('Registered');
                res.json({
                  authState: authStates.GUEST,
                  user: {},
                  successMessage:
                    'Congratulations! You are registered, and you can log in now.',
                });
              })
              .catch((err) => {
                if (err) {
                  console.log(err);
                  res.json({
                    authState: authStates.GUEST,
                    user: {},
                    errorMessage:
                      'Something went wrong. An account with this email may already exist',
                  });
                }
              });
          });
        });
      }
    });
  } else {
    console.log('Validation on front end failed??');
    res.json({
      authState: authStates.GUEST,
      user: {},
      errorMessage:
        'Something went wrong. An account with this email may already exist',
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
