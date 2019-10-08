'use strict';
var mongoose = require('mongoose');
const { Timesheet } = require("../models/timesheet");
const isEmpty = require("../models/is_empty");
module.exports = {
    fullTimesheetDate: fullTimesheetDate,
    fullTimesheetAdminDate: fullTimesheetAdminDate
};

function fullTimesheetDate(req, res) {
    return new Promise(function () {
        const limitDate   = 5 ;
        const skipDate    = parseInt(req.query.eventskip); 
        const userID = !isEmpty(req.query.userID) ? req.query.userID : "";    
        Timesheet.find({$and:
            [
                { date:{$gte:new Date(req.query.startDate)}},
                { date:{$lte:new Date(req.query.endDate)}},
                { user_id:mongoose.Types.ObjectId(userID)}
            ]
        })
        .populate('user_id')
        .populate('task_id')
        .populate('project_id')
        .sort({ _id: -1 })
        .skip(skipDate)
        .limit(limitDate)
        .exec((err, doc) => {
            if (err) {
            return res.json(err);
            }
            Timesheet.countDocuments({$and:
                [
                    { date:{$gte:new Date(req.query.startDate)}},
                    { date:{$lte:new Date(req.query.endDate)}},
                    { user_id:mongoose.Types.ObjectId(userID)}
                ]
            }).exec((count_error, count) => {
            if (err) {
                return res.json(count_error);
            }
            res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skipDate,"pageSize":req.query.eventskip,"data":doc});
            
            });
        });
       
    });    
}

function fullTimesheetAdminDate(req, res) {
    return new Promise(function () {
        const limitDate   = 5 ;
        const skipDate    = parseInt(req.query.eventskip);   
        Timesheet.find({$and:
            [
                { date:{$gte:new Date(req.query.startDate)}},
                { date:{$lte:new Date(req.query.endDate)}}
            ]
        })
        .populate('user_id')
        .populate('task_id')
        .populate('project_id')
        .sort({ _id: -1 })
        .skip(skipDate)
        .limit(limitDate)
        .exec((err, doc) => {
            if (err) {
            return res.json(err);
            }
            Timesheet.countDocuments({$and:
                [
                    { date:{$gte:new Date(req.query.startDate)}},
                    { date:{$lte:new Date(req.query.endDate)}}
                ]
            }).exec((count_error, count) => {
            if (err) {
                return res.json(count_error);
            }
            res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skipDate,"pageSize":req.query.eventskip,"data":doc});
            
            });
        });
       
    });    
}




