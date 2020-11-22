export const PATTERN = {
  EMAIL_VALIDATION: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  NAME_VALIDATION: /^[a-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžßÇŒÆČŠŽ∂ð ,.'-]{1,250}$/iu,
  PASSWORD_VALIDATION: /^(?=.*[0-9])(?=.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{6,16}$/,
  MONGOID_VALIDATION: /^[a-f\d]{24}$/i,
};

export const NAME_ATTRIBUTE_TO_PATTERN_MAP = {
  firstName: PATTERN.NAME_VALIDATION,
  lastName: PATTERN.NAME_VALIDATION,
  email: PATTERN.EMAIL_VALIDATION,
  password: PATTERN.PASSWORD_VALIDATION,
  password2: PATTERN.PASSWORD_VALIDATION,
};
