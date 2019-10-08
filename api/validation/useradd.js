const Validator = require("validator");
const isEmpty = require("../models/is_empty");

function validateUseradd(data) {
    let errors = {};
  
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
  
    if (!Validator.isEmail(data.email)) {
      errors.email = "Emails is invalid";
    }
  
    if (Validator.isEmpty(data.email)) {
      errors.email = "Emails field is required";
    }
  
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
      errors.name = "name must be length 8 to 100 characters";
    }
  
    if (Validator.isEmpty(data.name)) {
      errors.name = "name field is required";
    }
  
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
  
  exports.validateUseradd = validateUseradd;