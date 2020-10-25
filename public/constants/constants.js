module.exports = Object.freeze({
  FLASH_MESSAGES: {
    REDIRECT_ERRORS: {
      INVALID_LINK: "That link is invalid. Please try again.",
      GENERIC_ERROR: "Sorry, something went wrong. Please try again.",
    },
    REDIRECT_SUCCESSES: {
      FORGOT_PASSWORD_SUBMISSION:
        "An email has been sent to the address provided with a link to reset your password",
      REGISTRATION_SUCCESS: "Your account has been registered!",
    },
  },
  REGEX: {
    EMAIL_VALIDATION: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    NAME_VALIDATION: /^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžßÇŒÆČŠŽ∂ð ,.'-]{1,250}$/iu,
    PASSWORD_VALIDATION: /^(?=.*[0-9])(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{6,16}$/,
  },
});