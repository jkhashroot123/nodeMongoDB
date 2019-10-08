const mongoose = require("mongoose");
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const Schema = mongoose.Schema;
const Validator = require("validator");
const isEmpty = require("./is_empty");

const TimesheetSchema = new Schema({
    
  project_id: { type: mongoose.Schema.ObjectId, ref: 'projects', required: true },
  task_id: { type: mongoose.Schema.ObjectId, ref: 'tasks', required: true },
  user_id: { type: mongoose.Schema.ObjectId, ref: 'timer_user', required: true },
  notes: {
    type: 'string',
    required: true
  },
  date: {
    type: 'Date',
    required: true
  },
  entertime: {
    type: 'string',
    required: false
  },
  createddate: {
    type: 'Date',
	  default: Date.now,
    required: true
  }
});

var collectionName = 'timesheet'
const Timesheet = mongoose.model("timesheet",
TimesheetSchema,
  collectionName
);
TimesheetSchema.plugin(mongooseAggregatePaginate);
function validateTimeSheetInput(data) {
  let errors = {};
  data.project_id = !isEmpty(data.project_id) ? data.project_id : "";
  data.task_id = !isEmpty(data.task_id) ? data.task_id : "";
  data.notes = !isEmpty(data.notes) ? data.notes : "";
  //data.entertime = !isEmpty(data.entertime) ? data.entertime : "";
 
  if (Validator.isEmpty(data.project_id)) {
    errors.project_id = "Project field is required";
  }

  if (Validator.isEmpty(data.task_id)) {
    errors.task_id = "Task field is required";
  }

  if (Validator.isEmpty(data.notes)) {
    errors.notes = "Notes field is required";
  }
  // if (Validator.isEmpty(data.entertime)) {
  //   errors.entertime = "Time field is required";
  // }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
}
exports.TimesheetSchema = TimesheetSchema;
exports.Timesheet = Timesheet;
exports.validateTimeSheetInput = validateTimeSheetInput;