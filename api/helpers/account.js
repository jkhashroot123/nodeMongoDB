const sgMail = require('@sendgrid/mail');
const config = require("config");

sgMail.setApiKey(config.sendGridAPIKey);

const sendWelcomeEmail = (email,name)=>{
    
}

module.exports = {
    sendWelcomeEmail
}