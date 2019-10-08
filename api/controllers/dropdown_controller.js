'use strict';

const { userroleDetails } = require("../models/user_roles");
const { ProjectDetails }  = require("../models/get_project_details");
const { TaskDetails }     = require("../models/get_task_details");
const { User }            = require("../models/user");



module.exports = {
  getProjectData: getProjectData,
  getTaskData: getTaskData,
  getUserroleData: getUserroleData,
  getallusers: getallusers
};


function getProjectData (req, res) {
  ProjectDetails.find({},['project_name'], function(err, result) {
    if (err) {
        res.json(err);
    }
    else {
        res.json(result);
    } 
  })
}

function getUserroleData (req, res) {
  return userroleDetails.find()
  .exec((err, userroles) => {
    if (err) {
      res.json(err);
    }
   else {
      res.json(userroles);
    } 
  })
}

function getallusers (req, res) {
  return User.find()
  .exec((err, users) => {
    if (err) {
      res.json(err);
    }
   else {
      res.json(users);
    } 
  })
}

function getTaskData(req, res) {
  return TaskDetails.find({ project_id: req.query.projectid })
    .populate('project_id')
    .exec((err, projects) => {
      if (err) {
        res.json(err);
      }
     else {
        res.json(projects);
      } 
    })
}



