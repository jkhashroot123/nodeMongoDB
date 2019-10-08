const { TaskDetails,validateTask } = require("../models/get_task_details");
const mongoose = require('mongoose');
module.exports = {
  saveTasks : saveTasks,
  FetchAllTasks: FetchAllTasks,
  getFullTaskDatas: getFullTaskDatas,
  deleteTasklist: deleteTasklist,
  //updateTask: updateTask,
  fetchTaskByID: fetchTaskByID,
  fetchAllTaskbyname: fetchAllTaskbyname
}
function saveTasks(req, res) {
  if(req.body._id == null){ 
    let taskdet = new TaskDetails({
        task_name: req.body.task_name,
        project_id: mongoose.Types.ObjectId(req.body.project_id),
        createddate: new Date().toISOString()
    });
    taskdet.save().then((result) => {
      res.json({ "message": "Task Added", "data": result })
  })
  .catch(err => console.error(err));
  
  }
  else{
      let tasks = {
          _id: mongoose.Types.ObjectId(req.body._id),
          task_name: req.body.task_name,
          project_id: mongoose.Types.ObjectId(req.body.project_id),
          createddate: new Date().toISOString()
  
      }
      TaskDetails.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, { $set: tasks },
      function (err, result) {
          if (err) {
            res.json({ "message": "Error", "msg": err });          
          } else {              
            res.json({ "message": "Task Updated", "msg": result });
          }
      });
  }
}

function FetchAllTasks(req, res) {
  TaskDetails.find({}, function (err, restasks) {
      if(err){
          console.log(err);
      } else{
          return res.json(restasks);
      }
  })
}

function getFullTaskDatas(req, res) {
  const limitTask = 5;
  const skipTask = parseInt(req.query.eventskip);   
  return new Promise(function () {   
    TaskDetails.find()
      .populate('project_id')
      .sort({ _id: -1 })
      .skip(skipTask) //Notice here
      .limit(limitTask)
      .exec((err, doc) => {
          if (err) {
          return res.json(err);
          }
          TaskDetails.countDocuments().exec((count_error, count) => {
          if (err) {
              return res.json(count_error);
          }
          res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skipTask,"pageSize":req.query.eventtake,"data":doc});
                
       
      });
  });
 
});
}

function deleteTasklist(req, res) {
  return new Promise(function () {
    let taskid = req.query.taskid;
    TaskDetails.findByIdAndRemove(taskid, (err, tasks) => {
      if (err) {
        return res.json({ "message": "Task not deleted", "response": err });
      }
     
      return res.json({ "message": "Task successfully deleted", "data": tasks })
    });
  });
}


function fetchTaskByID(req, res) {
  TaskDetails.findOne({_id:mongoose.Types.ObjectId(req.query.taskid)})
  .exec((err,task) => {
      if (err) {
          res.json({ "message": "Error", "result": err });        
      } else {
          res.json({ "message": "Fetch Data ", "result": task });
      }
  })
}


function fetchAllTaskbyname(req, res) {
  const limitTask = 5;
  const skipTask = parseInt(req.query.eventskipTask);   
  return new Promise(function () {   
    TaskDetails.find({_id:mongoose.Types.ObjectId(req.query.searchTask)})
    .populate('project_id')
      .sort({ _id: -1 })
      .skip(skipTask) //Notice here
      .limit(limitTask)
      .exec((err, doc) => {
          if (err) {
          return res.json(err);
          }
          TaskDetails.countDocuments(
              {_id:mongoose.Types.ObjectId(req.query.searchTask)}).exec((count_error, count) => {
          if (err) {
              return res.json(count_error);
          }
          res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skipTask,"pageSize":req.query.eventtakeTask,"data":doc});
                
       
      });
  });
 
});  
}
