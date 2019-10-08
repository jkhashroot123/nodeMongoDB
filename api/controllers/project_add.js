const { ProjectDetails, validateProject } = require("../models/get_project_details");
const mongoose = require('mongoose');
module.exports = {
    projectadd : projectadd,
    FetchAllProjects: FetchAllProjects,
    FetchFullProjectDatas: FetchFullProjectDatas,
    deleteProjectlist: deleteProjectlist,
    //updateProject: updateProject,
    fetchProjectByID: fetchProjectByID
}
function projectadd(req, res) {

    if(req.body._id == null){ 
        const projectsdeta = new ProjectDetails({
            project_name: req.body.project_name,
            createddate: new Date().toISOString()
        });
        projectsdeta.save().then((result) => {
            res.json({ "message": "Project Added", "data": result })
        })
        .catch(err => console.error(err));
       
    }
    else {
        const projectsdet = new ProjectDetails({
            _id: req.body._id,
            project_name: req.body.project_name,
            createddate: new Date().toISOString()
        });    
        ProjectDetails.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, { $set: projectsdet },
        function (err, result) {
            if (err) {

            res.json({ "message": "Error", "msg": err })
            
            } else {
                
            res.json({ "message": "Project Updated", "msg": result })
            }
        });
      

    }

        

}
function FetchAllProjects(req, res) {
    const limitProject = 5;
    const skipProject = parseInt(req.query.eventskipProject);   
    return new Promise(function () {   
        ProjectDetails.find({_id:mongoose.Types.ObjectId(req.query.searchProject)})
        .sort({ _id: -1 })
        .skip(skipProject) //Notice here
        .limit(limitProject)
        .exec((err, doc) => {
            if (err) {
            return res.json(err);
            }
            ProjectDetails.countDocuments(
                {_id:mongoose.Types.ObjectId(req.query.searchProject)}).exec((count_error, count) => {
            if (err) {
                return res.json(count_error);
            }
            res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skipProject,"pageSize":req.query.eventtakeProject,"data":doc});
                  
         
        });
    });
   
});  
}



function FetchFullProjectDatas(req, res) {
    const limitProject = 5;
    const skipProject = parseInt(req.query.eventskip);   
    return new Promise(function () {   
        ProjectDetails.find()
        .sort({ _id: -1 })
        .skip(skipProject) //Notice here
        .limit(limitProject)
        .exec((err, doc) => {
            if (err) {
            return res.json(err);
            }
            ProjectDetails.countDocuments().exec((count_error, count) => {
            if (err) {
                return res.json(count_error);
            }
            res.json({ "message": "Fetch Data on datewise", "total": count,"page" :skipProject,"pageSize":req.query.eventtake,"data":doc});
                  
         
        });
    });
   
});  
}

function deleteProjectlist(req, res) {
    return new Promise(function () {
      let projectid = req.query.projectid;
      ProjectDetails.findByIdAndRemove(projectid, (err, projects) => {
        if (err) {
          return res.json({ "message": "Project not deleted", "response": err });
        }
        return res.json({ "message": "Project successfully deleted", "data": projects })
      });
    });
  }

function fetchProjectByID(req, res) {
    ProjectDetails.findOne({_id:req.query.projectid})
    .exec((err,project) => {
        if (err) {
            res.json({ "message": "Error", "result": err });        
        } else {
            res.json({ "message": "Fetch Data ", "result": project });
        }
    })
}