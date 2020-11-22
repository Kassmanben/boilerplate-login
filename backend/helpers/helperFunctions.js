module.exports = {
  isStatusOk: function (status) {
    return status > 199 && status < 300;
  },
  isEmptyObject: function (obj) {
    return Object.keys(obj).length == 0;
  },
  validateByRegex: function (text, pattern) {
    return pattern.test(String(text).toLowerCase());
  },
};
