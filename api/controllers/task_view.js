const mongoose = require('mongoose');

const {taskSch} = require('../models/get_task_details');
module.exports = {
    taskview : taskview
}

var tasks = mongoose.model('tasks', taskSch);

function taskview(req, res) {
    tasks.find({ "project_id": req.params.projectId }, function (err, restasks) {
        if(err){
            console.log(err);
        } else{
            return res.json(restasks);
        }
    })
}
