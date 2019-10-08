
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task_name : {
    type:'string'
  },
  project_id : { type: mongoose.Schema.ObjectId, ref: 'projects'},
  createddate: {
    type:'Date'
  }
});

var collectionName = 'tasks'
const TaskDetails = mongoose.model("tasks",taskSchema,collectionName);
function validateTask(data) {
  let errors = {};
  data.project_id = !isEmpty(data.project_id) ? data.project_id : "";
  data.task_name = !isEmpty(data.task_name) ? data.task_name : "";
  //data.entertime = !isEmpty(data.entertime) ? data.entertime : "";
 
  if (Validator.isEmpty(data.project_id)) {
    errors.project_id = "Project field is required";
  }

  if (Validator.isEmpty(data.task_name)) {
    errors.task_name = "Task field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
exports.taskSchema = taskSchema;
exports.TaskDetails = TaskDetails;
exports.validateTask = validateTask;