/*
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var aws=require('aws-sdk');
var config=require('../../server/backend_config.js');
var api_log=require('../misc/logging.js');

aws.config.loadFromPath('./aws-credentials.json');
var ses=new aws.SES();

function sendEmail(user,content,subject,callback) {
    var params={Destination: 
                {ToAddresses:[config.get_admin_email()]},
                Message:{Body:{Html:{Data:content}},Subject:{Data:subject}},
                    Source:config.get_admin_email()};
    
    ses.sendEmail(params,function(err,data){})
            .on('success',function(){ 
                callback(null);})
            .on('error',function(err){
                callback("ERROR_SENDING_EMAIL");});
    
}

// Functions which will be available to external callers
module.exports.sendEmail = sendEmail;
