'use strict';

const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const cors = require('cors')
const configs = require("config");
const express = require('express');
const jwt_decode = require('jwt-decode');
app.use(cors())
module.exports = app; 
const config = {
  appRoot: __dirname 
};
configs["jwtPrivateKey"] = "mySecureKey";

if (!configs.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
} else {
}

app.use(express.static('build/public'));
  app.use(express.static('build'));
  // app.get('/', function response(req, res) {
  //   res.sendFile('build/index.html');
  // });



  config.swaggerSecurityHandlers = {
    
    Bearer : function (req, authOrSecDef, scopesOrApiKey, cb) {
      try{
        const decoded = jwt_decode(scopesOrApiKey);
        req.requestContext = {
          authorizer : {
            claims : decoded
          }
        };
  
        cb();
      }catch(error){
        cb(error);
      }
    }
  };

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  swaggerExpress.register(app);
  const port = process.env.PORT || 9000;
  app.listen(port);
  if (swaggerExpress.runner.swagger.paths['/swagger']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/swagger');
  }
});
console.log("user reached")
const mongoose = require("mongoose");
mongoose
 .connect(configs.get("mongo_url"),{ useNewUrlParser: true })
 .then(() => console.log("Connected to MongoDB..."))
 .catch(err => console.error(err));

