'use strict';
var mongoose = require('mongoose');
const {Timesheet} = require("../models/timesheet");
//const { validateUser } = require("../validation/undefinedFunctions");
const isEmpty = require("../models/is_empty");
module.exports = {
    fullTimesheetProject:fullTimesheetProject,
    fullTimesheetAdminProject: fullTimesheetAdminProject
};



function fullTimesheetProject(req, res) {
    const limitProject = 5;
    const skipProject = parseInt(req.query.eventskipProject);   
    return new Promise(function () {   
        Timesheet.find({$and:[{user_id:mongoose.Types.ObjectId(req.query.userID)},
            {project_id:mongoose.Types.ObjectId(req.query.searchProject)}]})
        .populate('user_id')
        .populate('task_id')
        .populate('project_id')
        .sort({ _id: -1 })
        .skip(skipProject) //Notice here
        .limit(limitProject)
        .exec((err, doc) => {
            if (err) {
            return res.json(err);
            }
            Timesheet.countDocuments(
                {$and:[{user_id:mongoose.Types.ObjectId(req.query.userID)},
                    {project_id:mongoose.Types.ObjectId(req.query.searchProject)}
                ]}).exec((count_error, count) => {
            if (err) {
                return res.json(count_error);
            }
            res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skipProject,"pageSize":req.query.eventtakeProject,"data":doc});
                  
         
        });
    });
   
});  
}

function fullTimesheetAdminProject(req, res) {
    const limitProjectAdmin = 5;
    const skipProjectAdmin = parseInt(req.query.eventskipProject);   
    return new Promise(function () {   
        Timesheet.find({project_id:mongoose.Types.ObjectId(req.query.searchProject)})
        .populate('user_id')
        .populate('task_id')
        .populate('project_id')
        .sort({ _id: -1 })
        .skip(skipProjectAdmin) //Notice here
        .limit(limitProjectAdmin)
        .exec((err, doc) => {
            if (err) {
            return res.json(err);
            }
            Timesheet.countDocuments({project_id:mongoose.Types.ObjectId(req.query.searchProject)}
                ).exec((count_error, count) => {
            if (err) {
                return res.json(count_error);
            }
            res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skipProjectAdmin,"pageSize":req.query.eventtakeProject,"data":doc});
                  
         
        });
    });
   
});  
}



