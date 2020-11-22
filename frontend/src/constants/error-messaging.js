export const REDIRECT = {
  EDIT_PROFILE_ERROR: 'There were errors updating your profile.',
  INVALID_LINK: 'That link is invalid. Please try again.',
  NOT_FOUND: "The page you're looking for was not found.",
  GENERIC_ERROR: 'Sorry, something went wrong. Please try again.',
};

export const VALIDATION = {
  EMPTY_FIRST_NAME: 'Please enter your first name',
  EMPTY_LAST_NAME: 'Please enter your last name',
  EMPTY_EMAIL: 'Please enter an email address',
  EMPTY_PASSWORD: 'Please enter a password',
  INVALID_NAME:
    "Your name must contain only letters and valid special characters (,.'-)",
  INVALID_EMAIL: 'Please enter a valid email address',
  WEAK_PASSWORD:
    'Your password must include one lowercase letter, a number and special character',
  PASSWORD_MATCH: 'Your passwords must match',
};

export const NAME_ATTRIBUTE_TO_ERROR_MAP = {
  EMPTY: {
    firstName: VALIDATION.EMPTY_FIRST_NAME,
    lastName: VALIDATION.EMPTY_LAST_NAME,
    email: VALIDATION.EMPTY_EMAIL,
    password: VALIDATION.EMPTY_PASSWORD,
    password2: VALIDATION.EMPTY_PASSWORD,
  },
  INVALID: {
    firstName: VALIDATION.INVALID_NAME,
    lastName: VALIDATION.INVALID_NAME,
    email: VALIDATION.INVALID_EMAIL,
    password: VALIDATION.WEAK_PASSWORD,
    password2: VALIDATION.PASSWORD_MATCH,
  },
};
