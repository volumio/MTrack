/*
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var api_log=require('../misc/logging.js')
var config = require('../../server/backend_config.js');
var ses_utils=require('./ses_utils.js');

function sendAcceptanceEmailToAdmin(user,content,callback) {
    ses_utils.sendEmail(user,content,'Account activation',function(err)
    {
        if(err!=null)
            callback(err);
        else callback(null,null);
    });
    
    
}

function sendAccountActiveToUser(user,content,callback) {
    ses_utils.sendEmail(user,content,'Your account is now active',function(err)
    {
        if(err!=null)
            callback(err);
        else callback(null,null);
    });
}
// Functions which will be available to external callers
module.exports.sendAcceptanceEmailToAdmin = sendAcceptanceEmailToAdmin;
module.exports.sendAccountActiveToUser = sendAccountActiveToUser;
