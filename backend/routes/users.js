const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const mongoose = require("mongoose");
const constants = require("../public/constants/constants");
var mandrill = require("mandrill-api");
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL);

// Load User model
const User = require("../models/User");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const moment = require("moment");

function validateText(text, regexPattern) {
  return regexPattern.test(String(text).toLowerCase());
}

function isErrorObjectEmpty(obj) {
  for (var key in obj) {
    if (obj[key] !== null && obj[key] != "") return false;
  }
  return true;
}

// Register Page
router.get("/register", ensureGuest, (req, res) =>
  res.render("register", {
    layout: "login",
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      password2: "",
    },
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
  })
);

// Forgot Page
router.get("/forgot", ensureGuest, (req, res) =>
  res.render("forgot", {
    layout: "login",
  })
);

// @desc Show reset password page
// @route GET /reset/:id
router.get("/reset/:id", ensureGuest, async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await User.findOne({
        resetToken: new mongoose.Types.ObjectId(req.params.id),
      }).lean();

      if (!user) {
        req.session.sessionFlash = {
          type: "alert-warning",
          message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.INVALID_LINK,
        };
        console.log("User not found");
        return res.redirect("/");
      }

      if (moment(user.resetTimeout).isBefore(moment())) {
        req.session.sessionFlash = {
          type: "alert-warning",
          message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.INVALID_LINK,
        };
        console.log("Retry link has timed out");
        res.redirect("/");
      } else {
        res.render("reset", {
          layout: "login",
          user,
        });
      }
    } else {
      req.session.sessionFlash = {
        type: "alert-warning",
        message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.INVALID_LINK,
      };
      console.log("Retry link has invalid token id");
      return res.redirect("/");
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

router.post("/forgot", ensureGuest, async (req, res) => {
  // TODO: Add validation to make sure this is an email
  const { email } = req.body;
  let resetToken = new mongoose.Types.ObjectId();

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    req.session.sessionFlash = {
      type: "alert-success",
      message:
        constants.FLASH_MESSAGES.REDIRECT_SUCCESSES.FORGOT_PASSWORD_SUBMISSION,
    };
    console.error("User does not exist");
    return res.redirect("/");
  } else {
    user.set({
      resetToken: resetToken,
      resetTimeout: moment().add(1, "hours"),
    });
    user.save();
    let link = "http://localhost:3000/users/reset/" + resetToken;
    let text =
      "We've recieved a password change request for your Storybooks account. </p><p> If you did not ask to change your password, then you can ignore this email and your password will not be changed. The link below will remain active for 1 hour.";
    var message = {
      html:
        "<p>" +
        text +
        "</p>" +
        '<a href="' +
        link +
        '" > Reset your password here </a>',
      text: text.replace("</p><p> ", "") + " " + link,
      subject: "Storybooks password change request",
      from_email: "me@kassmanben.com",
      from_name: "Storybooks",
      to: [
        {
          email: user.email,
          name: user.displayName,
          type: "to",
        },
      ],
    };
    var async = false;
    var ip_pool = "Main Pool";
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
          "A mandrill error occurred: " + err.name + " - " + err.message
        );
      }
    );
    req.session.sessionFlash = {
      type: "alert-success",
      message:
        constants.FLASH_MESSAGES.REDIRECT_SUCCESSES.FORGOT_PASSWORD_SUBMISSION,
    };
    return res.redirect("/");
  }
});

// Register
router.post("/reset/:id", async (req, res) => {
  const { password, password2 } = req.body;

  let errors = {
    password:
      password && validateText(password, constants.REGEX.PASSWORD_VALIDATION)
        ? ""
        : "Your password must include one lowercase letter, a number and special character",
    password2:
      password && validateText(password, constants.REGEX.PASSWORD_VALIDATION)
        ? ""
        : "Your passwords must match",
  };

  if (isErrorObjectEmpty(errors)) {
    const user = await User.findOne({
      _id: req.params.id,
    });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        res.render(`/reset/${req.params.id}`, {
          layout: "login",
          sessionFlash: {
            type: "alert-danger",
            message: "Sorry, something went wrong",
          },
          errors,
          password: "",
          password2: "",
        });
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          res.render(`/reset/${req.params.id}`, {
            layout: "login",
            sessionFlash: {
              type: "alert-danger",
              message: "Sorry, something went wrong",
            },
            errors,
            password: "",
            password2: "",
          });
        }
        user.password = hash;
        user
          .save()
          .then((user) => {
            req.session.sessionFlash = {
              type: "alert-success",
              message:
                constants.FLASH_MESSAGES.REDIRECT_SUCCESSES
                  .REGISTRATION_SUCCESS,
            };
            res.redirect("/");
          })
          .catch((err) => {
            res.render(`/reset/${req.params.id}`, {
              layout: "login",
              sessionFlash: {
                type: "alert-danger",
                message: "Sorry, something went wrong",
              },
              errors,
              password: "",
              password2: "",
            });
          });
      });
    });
  } else {
    const user = await User.findOne({
      resetToken: new mongoose.Types.ObjectId(req.params.id),
    }).lean();
    res.render(`/reset/${req.params.id}`, {
      layout: "login",
      errors,
      user,
    });
  }
});

// Register
router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;
  let errors = {
    firstName: !firstName
      ? "Please enter your first name"
      : validateText(firstName, constants.REGEX.NAME_VALIDATION)
      ? ""
      : "Your name must contain only letters and valid special characters (,.'-)",
    lastName: !lastName
      ? "Please enter your last name"
      : validateText(lastName, constants.REGEX.NAME_VALIDATION)
      ? ""
      : "Your name must contain only letters and valid special characters (,.'-)",
    email:
      email && validateText(email, constants.REGEX.EMAIL_VALIDATION)
        ? ""
        : "Please enter a valid email address",
    password:
      password && validateText(password, constants.REGEX.PASSWORD_VALIDATION)
        ? ""
        : "Your password must include one lowercase letter, a number and special character",
    password2:
      password && validateText(password, constants.REGEX.PASSWORD_VALIDATION)
        ? ""
        : "Your passwords must match",
  };

  if (isErrorObjectEmpty(errors)) {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        res.render("register", {
          layout: "login",
          sessionFlash: {
            type: "alert-danger",
            message: "Email already exists",
          },
          errors,
          firstName,
          lastName,
          email,
          password: "",
          password2: "",
        });
      } else {
        const newUser = new User({
          userId: mongoose.Types.ObjectId(),
          profileType: "local",
          displayName: firstName + " " + lastName,
          firstName,
          lastName,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            res.render("register", {
              layout: "login",
              sessionFlash: {
                type: "alert-danger",
                message: "Sorry, something went wrong",
              },
              errors,
              firstName,
              lastName,
              email,
              password: "",
              password2: "",
            });
          }
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              res.render("register", {
                layout: "login",
                sessionFlash: {
                  type: "alert-danger",
                  message: "Sorry, something went wrong",
                },
                errors,
                firstName,
                lastName,
                email,
                password: "",
                password2: "",
              });
            }
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.session.sessionFlash = {
                  type: "alert-success",
                  message:
                    constants.FLASH_MESSAGES.REDIRECT_SUCCESSES
                      .REGISTRATION_SUCCESS,
                };
                res.redirect("/");
              })
              .catch((err) => {
                if (err) {
                  res.render("register", {
                    layout: "login",
                    sessionFlash: {
                      type: "alert-danger",
                      message: "Sorry, something went wrong",
                    },
                    errors,
                    firstName,
                    lastName,
                    email,
                    password: "",
                    password2: "",
                  });
                }
              });
          });
        });
      }
    });
  } else {
    res.render("register", {
      layout: "login",
      errors,
      firstName,
      lastName,
      email,
      password: "",
      password2: "",
    });
  }
});

// Edit
router.put("/edit", ensureAuth, async (req, res) => {
  const { firstName, lastName, email } = req.body;
  let errors = {
    firstName: !firstName
      ? "Please enter your first name"
      : validateText(firstName, constants.REGEX.NAME_VALIDATION)
      ? ""
      : "Your name must contain only letters and valid special characters (,.'-)",
    lastName: !lastName
      ? "Please enter your last name"
      : validateText(lastName, constants.REGEX.NAME_VALIDATION)
      ? ""
      : "Your name must contain only letters and valid special characters (,.'-)",
    email:
      email && validateText(email, constants.REGEX.EMAIL_VALIDATION)
        ? ""
        : "Please enter a valid email address",
  };

  if (isErrorObjectEmpty(errors)) {
    let user = await User.findOne({ email: email }).lean();
    if (!user) {
      req.session.sessionFlash = {
        type: "alert-danger",
        message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.GENERIC_ERROR,
      };
      console.error(err);
      res.redirect("/profile");
    }

    if (user._id != req.user.id) {
      res.redirect("/profile");
    } else {
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          displayName: firstName + " " + lastName,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      req.session.sessionFlash = {
        type: "alert-success",
        message:
          constants.FLASH_MESSAGES.REDIRECT_SUCCESSES.STORY_EDITED_SUCCESS,
      };
      console.log("User Updated");
      res.redirect("/profile");
    }
  } else {
    req.session.sessionFlash = {
      type: "alert-danger",
      message: constants.FLASH_MESSAGES.REDIRECT_ERRORS.EDIT_PROFILE_ERROR,
    };
    res.redirect("/profile");
  }
});

// Login
router.post("/login", ensureGuest, (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log("TOP LEVEL ERR:", err);
      return next(err);
    }
    if (!user) {
      return res.json({
        authState: constants.AUTHSTATES.GUEST,
        user: {},
        error: "You have entered an invalid email or password",
      });
    }

    req.logIn(user, function (err) {
      if (err) {
        console.log("ERRORHEREMAYBE??");
        return next(err);
      }
      return res.json({ authState: constants.AUTHSTATES.LOGGEDIN, user });
    });
  })(req, res, next);
});

module.exports = router;
