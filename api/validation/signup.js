// const Validator = require("validator");
// const isEmpty = require("../models/is_empty");

// function validateSignup(data) {
//   console.log(data)
//   let errors = {};
//   // data.role = !isEmpty(data.role) ? data.role : "";
//   data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
//   data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
//   data.email = !isEmpty(data.email) ? data.email : "";
//   data.password = !isEmpty(data.password) ? data.password : "";

//   // if (Validator.isEmpty(data.role)) {
//   //   errors.role = "role field is required";
//   // }

//   if (!Validator.isLength(data.first_name, { min: 3, max: 30 })) {
//     errors.first_name = "first_name must be length 3 to 30 characters";
//   }

//   if (Validator.isEmpty(data.first_name)) {
//     errors.first_name = "first_name field is required";
//   }
//   if (!Validator.isLength(data.last_name, { min: 3, max: 30 })) {
//     errors.last_name = "last_name must be length 3 to 30 characters";
//   }

//   if (Validator.isEmpty(data.last_name)) {
//     errors.last_name = "last_name field is required";
//   }
//   if (!Validator.isEmail(data.email)) {
//     errors.email = "Emails is invalid";
//   }

//   if (Validator.isEmpty(data.email)) {
//     errors.email = "Emails field is required";
//   }

//   if (!Validator.isLength(data.password, { min: 8, max: 100 })) {
//     errors.password = "password must be length 8 to 100 characters";
//   }

//   if (Validator.isEmpty(data.password)) {
//     errors.password = "password field is required";
//   }

//   return {
//     errors,
//     isValid: isEmpty(errors)
//   };
// }


// exports.validateSignup = validateSignup;