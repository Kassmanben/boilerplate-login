module.exports = Object.freeze({
  FLASH_MESSAGES: {
    REDIRECT_ERRORS: {
      EDIT_PROFILE_ERROR: "There were errors updating your profile.",
      INVALID_LINK: "That link is invalid. Please try again.",
      NOT_FOUND: "The page you're looking for was not found.",
      GENERIC_ERROR: "Sorry, something went wrong. Please try again.",
    },
    REDIRECT_SUCCESSES: {
      FORGOT_PASSWORD_SUBMISSION:
        "An email has been sent to the address provided with a link to reset your password",
      REGISTRATION_SUCCESS: "Your account has been registered!",
      STORY_ADDED_SUCCESS: "Your story has been posted!",
      STORY_EDITED_SUCCESS: "Your story has been updated!",
      STORY_DELETED_SUCCESS: "Your story has been deleted!",
    },
  },
  REGEX: {
    EMAIL_VALIDATION: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    NAME_VALIDATION: /^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžßÇŒÆČŠŽ∂ð ,.'-]{1,250}$/iu,
    PASSWORD_VALIDATION: /^(?=.*[0-9])(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{6,16}$/,
  },
});
