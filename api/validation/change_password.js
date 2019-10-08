const Validator = require("validator");
const isEmpty = require("../models/is_empty");

function validateChangePassword(data) {
  
  let errors = {};

  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : "";
  data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : "";

  if (!Validator.isLength(data.newPassword, { min: 8, max: 100 })) {
    errors.newPassword = "New Password must be length 8 to 100 characters";
  }

  if (Validator.isEmpty(data.newPassword)) {
    errors.newPassword = "New Password field is required";
  }

  if (!Validator.isLength(data.oldPassword, { min: 8, max: 100 })) {
    errors.oldPassword = "Old Password must be length 8 to 100 characters";
  }

  if (Validator.isEmpty(data.oldPassword)) {
    errors.oldPassword = "Old Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}


exports.validateChangePassword = validateChangePassword;