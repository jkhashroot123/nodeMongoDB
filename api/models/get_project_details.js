
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project_name : {
    type:'string'
  },
  createddate: {
    type:'Date'
  }
});

var collectionName = 'projects'
const ProjectDetails = mongoose.model("projects",projectSchema,collectionName);
function validateProject(data) {
  let errors = {};
  data.project_name = !isEmpty(data.project_name) ? data.project_name : "";

  if (Validator.isEmpty(data.project_id)) {
    errors.project_id = "Project field is required";
  }

  if (Validator.isEmpty(data.project_name)) {
    errors.project_name = "Project field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
exports.projectSchema = projectSchema;
exports.ProjectDetails = ProjectDetails;
exports.validateProject = validateProject;