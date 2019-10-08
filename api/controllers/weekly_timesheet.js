'use strict';
const mongoose = require('mongoose');
const {Timesheet} = require("../models/timesheet");
const isEmpty = require("../models/is_empty");

module.exports = {
    fullTimesheetWeekly: fullTimesheetWeekly,
    fullTimesheetAdminWeekly: fullTimesheetAdminWeekly
}
function fullTimesheetWeekly(req, res) {
    return new Promise(function () {
        const limit       = 5 ;
        const skip        = parseInt(req.query.eventskip);
        const userID = !isEmpty(req.query.userID) ? req.query.userID : "";
        let curr = new Date
        let week = []

        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() +i;
            let day = new Date(curr.setDate(first)).toISOString().slice(0,10);
            week.push(day);
        }
        let startDate = new Date(week[0]);
        let endDate = new Date(week[6]);

        Timesheet.find({$and:
            [
                { date:{$gte:new Date(startDate)}},
                { date:{$lte:new Date(endDate)}},
                { user_id:mongoose.Types.ObjectId(userID)}
            ]
        })
        .populate('user_id')
        .populate('task_id')
        .populate('project_id')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec((err, doc) => {
            if (err) {
            return res.json(err);
            }
            Timesheet.countDocuments({$and:
                [
                    { date:{$gte:new Date(startDate)}},
                    { date:{$lte:new Date(endDate)}},
                    { user_id:mongoose.Types.ObjectId(userID)}
                ]
            }).exec((count_error, count) => {
            if (err) {
                return res.json(count_error);
            }
            res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skip,"pageSize":req.query.eventtake,"data":doc});
            
            });
        });
       
    });  
}
function fullTimesheetAdminWeekly(req, res) {
    return new Promise(function () {
        const limit       = 5 ;
        const skip        = parseInt(req.query.eventskip);
        let curr = new Date
        let week = []

        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() +i;
            let day = new Date(curr.setDate(first)).toISOString().slice(0,10);
            week.push(day);
        }
        let startDate = new Date(week[0]);
        let endDate = new Date(week[6]);

        Timesheet.find({$and:
            [
                { date:{$gte:new Date(startDate)}},
                { date:{$lte:new Date(endDate)}}
            ]
        })
        .populate('user_id')
        .populate('task_id')
        .populate('project_id')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec((err, doc) => {
            if (err) {
            return res.json(err);
            }
            Timesheet.countDocuments({$and:
                [
                    { date:{$gte:new Date(startDate)}},
                    { date:{$lte:new Date(endDate)}}
                ]
            }).exec((count_error, count) => {
            if (err) {
                return res.json(count_error);
            }
            res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skip,"pageSize":req.query.eventtake,"data":doc});
            
            });
        });
       
    });  
}