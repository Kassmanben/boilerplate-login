const constants = require("../public/constants/constants");

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      console.log("User is not authenticated");
      res.status(401).json({
        user: {},
        authState: constants.AUTHSTATES.GUEST,
      });
    }
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log("User is already authenticated");
      res.status(200).json({
        user: req.user,
        authState: constants.AUTHSTATES.LOGGEDIN,
      });
    } else {
      return next();
    }
  },
};
