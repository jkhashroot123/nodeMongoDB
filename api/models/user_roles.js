
const mongoose = require("mongoose");

const timer_userRolesSchema = new mongoose.Schema({
  userrole_name : {
    type:'string'
  }
});

var collectionName = 'timer_userrole'
const userroleDetails = mongoose.model("timer_userrole",timer_userRolesSchema,collectionName);

exports.timer_userRolesSchema = timer_userRolesSchema;
exports.userroleDetails = userroleDetails;