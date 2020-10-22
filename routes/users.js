const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const mongoose = require("mongoose");
const constants = require("../public/constants/constants");
var mandrill = require("mandrill-api/mandrill");
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL);

// Load User model
const User = require("../models/User");
const { ensureGuest } = require("../middleware/auth");
const moment = require("moment");

// Register Page
router.get("/register", ensureGuest, (req, res) =>
  res.render("register", {
    layout: "login",
    errors: [],
    name: "",
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
        return res.redirect("/");
      }

      if (moment(user.resetTimeout).isBefore(moment())) {
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
      function (e) {
        console.log("A mandrill error occurred: " + e.name + " - " + e.message);
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

  let errors = [];

  if (!password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    const user = await User.findOne({
      _id: req.params.id,
    }).lean();
    res.render("reset", {
      errors,
      user,
      password,
      password2,
    });
  } else {
    const user = await User.findOne({
      _id: req.params.id,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user
          .save()
          .then((user) => {
            res.redirect("/");
          })
          .catch((err) => console.log(err));
      });
    });
  }
});

// Register
router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      firstName,
      lastName,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          firstName,
          lastName,
          email,
          password,
          password2,
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
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                res.redirect("/");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  })(req, res, next);
});

module.exports = router;
