'use strict';
const mongoose = require('mongoose');
const config = require("config");
const { User } = require("../models/user");
const auth = require('../middleware/auth')

// const { Email } = require("../helpers/email_service");

module.exports = {
  userreg: userreg,
  userlogin: userlogin,
  get_my_profile: get_my_profile,
  updateprofile: updateprofile,
  logout: logout
};


function userreg(req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            const user = new User(req.body);
            await user.save();
            const token = await user.generateAuthToken();
            res.status(201).json({ "message": "Signin successful", "token": token, "data": user });
        } catch (error) {
            res.status(400).json(error);
        }
    });
}
function userlogin(req, res) {
    return new Promise(async function (resolve, reject) {
      //Login a registered user
      try {
          const { email, password } = req.body;
          const user = await User.findByCredentials(email, password);
          if (!user) {
            res.status(403).json({ "message": "Login failed! Check authentication credentials"});
          }
          const token = await user.generateAuthToken();
          res.status(200).json({ "message": "Login successful", "token": token, "data": user })
      } catch (error) {
          res.status(400).json(error);
      }

    });
}

function get_my_profile(req, res) {
  //console.log(req)
  return new Promise(async function (resolve, reject) {
      // View logged in user profile
      return User.find({_id: req.query.userid}).exec((err, users) => {
        if (err) {
          res.status(403).json({ "message": "Failed! Check authentication credentials"});
        }
       else {
          res.json(users);
        } 
      })
  });
}

function updateprofile(req, res) {
  // save the post data
 var user = {
   first_name: req.body.first_name,
   last_name: req.body.last_name,
   email: req.body.email
 };
 user = User.updateMany({ _id: req.body._id }, { $set: user },
   function (err, users) {
     if (err) {
      res.status(403).json({ "message": "Failed! Check authentication credentials"});
       
     } else {
       res.json({ "message": "Profile Updated", "msg": users })
     }
   });
 }

 function logout(req, res) {
  return new Promise(async function (resolve, reject) {
      try {
        req.body.tokens = req.body.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.body.save()
        res.json({ "message": "Logout successfully", "msg": '' })
    } catch (error) {
        res.json(500).send(error)
    }
  });
}