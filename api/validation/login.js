const Validator = require("validator");
const isEmpty = require("../models/is_empty");

function validateLogin(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Emails is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Emails field is required";
  }

  if (!Validator.isLength(data.password, { min: 8, max: 100 })) {
    errors.password = "password must be length 8 to 100 characters";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

exports.validateLogin = validateLogin;