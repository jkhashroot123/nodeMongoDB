'use strict';
const mongoose = require('mongoose');

const { Timesheet,validateTimeSheetInput } = require("../models/timesheet");
module.exports = {
    saveTimesheet: saveTimesheet,
    fetchTimeCardData:fetchTimeCardData,
    fullTimesheet : fullTimesheet,
    getTimeTrackerDetails : getTimeTrackerDetails,
    deleteTimetracker:deleteTimetracker,
    updateTimecard:updateTimecard,
    getTimeTrackFull:getTimeTrackFull,
    fullTimesheetAdmin: fullTimesheetAdmin
    
};

function fullTimesheet(req, res) {
    return new Promise(function () {
        const limitUserId  = 5 ;
        const skipUserId   = parseInt(req.query.eventskip);     
        Timesheet.find({ user_id:mongoose.Types.ObjectId(req.query.userID) })
        .populate('user_id')
        .populate('task_id')
        .populate('project_id')
        .sort({ _id: -1 })
        .skip(skipUserId)
        .limit(limitUserId)
        .exec((err, doc) => {
            if (err) {
            return res.json(err);
            }
            Timesheet.countDocuments({ user_id:mongoose.Types.ObjectId(req.query.userID) }).exec((count_error, count) => {
            if (err) {
                return res.json(count_error);
            }
            res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skipUserId,"pageSize":req.query.eventtake,"data":doc});
            
            });
        });
       
    });  
}
function saveTimesheet(req, res) {
    const time =  req.body.entertime;
    const tasktime = time.hour+':'+time.minute;
    const { errors, isValid } = validateTimeSheetInput(req.body);

    if (!isValid) {
        return res.json({ "message": "Validation error", "msg": errors });
    }
    if(req.body._id == null){ 
        let timesheet = new Timesheet({
            date: req.body.activeDate,
            project_id: req.body.project_id,
            task_id: req.body.task_id,
            user_id: req.body.user_id,
            notes: req.body.notes,
            entertime: tasktime,
            createddate: new Date().toISOString()
        });
          
        // save the post data
        timesheet = timesheet.save().then((result) => {
            res.json({ "message": "Timesheet Added", "msg": result })
        })
        .catch(err => console.error(err));
    } 
    
   
}
function fetchTimeCardData(req, res) {  
    const timedate = req.query.date +'T00:00:00.000Z';
    Timesheet.find({user_id:req.query.userID,date:timedate})
    .populate('user_id')
    .populate('task_id')
    .populate('project_id')
    .exec((err, timecard) => {
        if (err) {
            res.json({ "message": "Error", "msg": err });        
        } else {
            res.json({ "message": "Fetch Data on datewise", "result": timecard });
        }
    })
}
function getTimeTrackerDetails(req, res) {
    Timesheet.findOne({_id:req.query.timetrackerid})
    .populate('user_id')
    .populate('task_id')
    .populate('project_id')
    .sort({ 'date': -1})
    .exec((err,timesheet) => {
        if (err) {
            res.json({ "message": "Error", "result": err });        
        } else {
            res.json({ "message": "Fetch Data on datewise", "result": timesheet });
        }
    })
}
function getTimeTrackFull(req, res) {
    Timesheet.aggregate([
        { $project: {
                date: '$date',
                user_id:'$user_id',
                entertime:'$entertime',
                notes:'$notes'
            }
        },
        { $match: 
                    {user_id:mongoose.Types.ObjectId(req.query.userID),
                    date: { $gte: new Date(req.query.startDate),$lte: new Date(req.query.endDate)}}
            
        },
        { $group: { _id: "$date",items: {
            $push: '$$ROOT'
        } } }, 
        { $limit: 10 }  
    
    ]).exec((err,timesheet) => {   
        let finalarr = [];      
        timesheet.forEach(function(u) {
            let totalTime =0;
            let timeInSeconds = 0;
            let dates = 0;
            let seconds = 0;             
             u.items.forEach(function(v) {      
                const a = v.entertime.split(':');
                seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60;
                timeInSeconds = seconds +totalTime;
                totalTime = totalTime + timeInSeconds;
                dates =  v.date;
            });
            const minimumTimeInSeconds = 8 * 60 * 60;
            const percentageTime = (totalTime / minimumTimeInSeconds) * 100;
            finalarr.push({'timesheetDate':dates,'totaltime':totalTime,'percentageTime':percentageTime});
                
        });
        if (err) {
            res.json({ "message": "Error", "result": err });        
        } else {  
            res.json({ "message": "Fetch Data on datewise", "result": finalarr });
        }
    })

}

function deleteTimetracker(req, res) {
    return new Promise(function () {
      let timetrackerid = req.query.timetrackerid;
      Timesheet.findByIdAndRemove(timetrackerid, (err, timesheet) => {
        if (err) {
          return res.json({ "message": "Time sheet not deleted", "response": err });
        }
        const response = {
          message: "Time Sheet successfully deleted",
          id: timesheet._id
        };
        return res.json({ "message": "Time Sheet", "response": response });
      });
    });
}
function updateTimecard(req, res)
{
    const time =  req.body.entertime;
    const tasktime = time.hour+':'+time.minute;
    const { errors, isValid } = validateTimeSheetInput(req.body);

    if (!isValid) {
        return res.json({ "message": "Validation error", "msg": errors });
    }
    if(req.body._id != null){ 
        let timecard = {
            notes: req.body.notes,
            project_id: req.body.project_id,
            task_id: req.body.task_id,
            user_id: req.body.user_id ,
            activeDate: req.body.activeDate,
            entertime:tasktime,
            createddate: new Date().toISOString()
   
        }
        Timesheet.updateOne({_id:req.body._id}, timecard, {upsert: true},function (err, timesheets) {
            if (err) {
                return res.json({ "message": "Update Error", "msg": err });
            }

            return res.json({ "message": "Timesheet Updated", "msg": timesheets });
        });
    }
  
}

function fullTimesheetAdmin(req, res) {
    return new Promise(function () {
        const limitUserId  = 5 ;
        const skipUserId   = parseInt(req.query.eventskip);     
        Timesheet.find()
        .populate('user_id')
        .populate('task_id')
        .populate('project_id')
        .sort({ _id: -1 })
        .skip(skipUserId)
        .limit(limitUserId)
        .exec((err, doc) => {
            if (err) {
            return res.json(err);
            }
            Timesheet.countDocuments().exec((count_error, count) => {
            if (err) {
                return res.json(count_error);
            }
            res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skipUserId,"pageSize":req.query.eventtake,"data":doc});
            
            });
        });
       
    });  
}