'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
const _ = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const config = require("config");
const { User } = require("../models/user");

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  changePassword: changePassword
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function changePassword(req, res) {
  return new Promise(function (resolve, reject) {
    let newPassword = req.body.newPassword;
    let oldPassword = req.body.oldPassword;
    let _id = req.body.user_id;

   // const { errors, isValid } = validateChangePassword(req.body);

    // if (!isValid) {
    //   return res.json({ "message": "Validation error", "msg": errors });
    // }

    return new Promise(function () {
      User.findOne({ _id: _id }, function (err, user) {
        if (user) {
          bcrypt.compare(oldPassword, user.password, function (err, result) {
            if (err) {
              res.json({ "message": "err", "msg": err });
            }
            else if (result) {
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  res.json({ "message": err });
                } else if (salt) {
                  generateHashPassword(newPassword, salt, user, req, res);
                }
              });
            } else {
              res.json({ "message": "Old password wrong", "msg": "Password change failed!" });
            }
          });
        } else if (err) {
          res.json({ "message": err });
        }
      });
    });
  });
}

function generateHashPassword(newPassword, salt, user, req, res) {
  bcrypt.hash(newPassword, salt, function (err, hash) {
    if (err) {
      res.json({ "message": err });
    } else if (hash) {
      user = user.updateOne({ password: hash, salt: salt })
        .then((result) => {
          res.json({ "message": "Password changed successfully" })
        })
        .catch(err =>
          res.json({ "message": "Password change failed", "msg": err })
        );
    }
  });
}
