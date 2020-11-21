const authStates = require('../public/constants/auth-states');

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      console.log('User is not authenticated');
      res.status(401).json({
        user: {},
        authState: authStates.GUEST,
      });
    }
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log('User is already authenticated');
      res.status(200).json({
        user: req.user,
        authState: authStates.LOGGEDIN,
      });
    } else {
      return next();
    }
  },
};
