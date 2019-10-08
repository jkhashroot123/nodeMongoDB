const mongoose = require('mongoose');
const {projectsch} = require('../models/get_project_details');
module.exports = {
    projects : projects
}
var project = mongoose.model('projects', projectsch);
function projects(req, res) {    
    project.find({},['_id', 'project_name'], function(err, sproject){
        if(err){
            console.log(err);
        } else{
            res.json(sproject);
        }
    })
}