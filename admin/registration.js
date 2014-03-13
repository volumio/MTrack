/*
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var api_log=require('../api/misc/logging.js');
var async=require('async');
var config=require('../server/backend_config.js');
var email_service =config.get_email_service();
var storage_service=config.get_data_storage();

function process_registration(req,res)
{
    var UUID=require('node-uuid').v1();
    
    async.series([
    function(callback)
    {
        storage_service.store_user_on_waiting_list(UUID,req.body,callback);
    },
    function(callback)
    {
        var user=req.body;
        var content="The following user registered: \n"+
                "Username: "+user['username']+"\n"+
                "Password: "+user['password']+"\n"+
                "Full name: "+user['full_name']+"\n"+
                "Society: "+user['society']+"\n\n"+
                "To activate click on the following link: "+UUID;
        email_service.sendAcceptanceEmailToAdmin(req.body['username'],content,callback);
    },
    function(callback)
    {
        res.redirect('/admin/public/registration_submitted.html');
    }
],
function(err,data){
    if(err!=null)
    {
        res.redirect('/admin/public/registration_error.html');  
    }
});
    
}

module.exports.process_registration=process_registration;