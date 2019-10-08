const isEmpty = require("../models/is_empty");
var mongoose = require('mongoose');

function validateUser(data) {
  var query1 = {};
    data.userID = !isEmpty(data.userID) ? data.userID : "";
    data.searchProject = !isEmpty(data.searchProject) ? data.searchProject : "";
    data.weekSearch = !isEmpty(data.weekSearch) ? data.weekSearch : "";
  
  if(data.userID !="" && data.startDate == "undefined" && data.endDate == "undefined" && data.searchProject == "undefined" && data.weekSearch == "") 
  {
      query1 = {user_id:mongoose.Types.ObjectId(data.userID)}
  }
  else if(data.userID !="" && data.searchProject !=""  && data.startDate == "undefined" && data.endDate == "undefined" && data.weekSearch == "")
  {
      query1 = {$and:[{user_id:mongoose.Types.ObjectId(data.userID)},{project_id:mongoose.Types.ObjectId(data.searchProject)}]};
  }
  else if(data.userID !="" && data.startDate != "undefined" && data.endDate != "undefined" && data.searchProject == "undefined" && data.weekSearch == ""){
      query1 = {$and:
          [
              { date:{$gte:new Date(data.startDate)}},
              { date:{$lte:new Date(data.endDate)}},
              {user_id:mongoose.Types.ObjectId(data.userID)}
          ]
          };
  }
  else if(data.userID!="" && data.weekSearch!="" && data.startDate == "undefined" && data.endDate == "undefined" && data.searchProject == "undefined"){
        let curr = new Date
        let week = []

        for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() +i;
        let day = new Date(curr.setDate(first)).toISOString().slice(0,10);
        week.push(day);
        }
        let startDate = new Date(week[0]);
        let endDate = new Date(week[6]);
        query1 = {$and:
            [
                { date:{$gte:new Date(startDate)}},
                { date:{$lte:new Date(endDate)}},
                {user_id:mongoose.Types.ObjectId(data.userID)}
            ]
            };
   
  }
  else if(data.userID!="" && data.weekSearch!="" && data.startDate == "undefined" && data.endDate == "undefined" && data.searchProject == "undefined")
  {  
    let month = '06';
    let year = '2019';
    let startDate_monthwise = year+'-'+month+'-01';
    let enddate_monthwise = year+'-'+month+'-31';
    query1 = {$and:
                [
                    {date:{$gte:new Date(startDate_monthwise)}},
                    {date:{$lte:new Date(enddate_monthwise)}},
                    {user_id:mongoose.Types.ObjectId(data.userID)}
                ]
            };
  }
return query = query1;

}


exports.validateEmptyFileds = validateEmptyFileds;