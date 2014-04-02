/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var async=require('async');
var config=require('../server/backend_config.js');
//var email_service =config.get_email_service();
var storage_service=config.get_data_storage();

function create_app(req, res) {
async.series([
    function(callback)
    {
        console.log(req.user);
        callback(null);
        //storage_service.read_user(req.body,callback);
    },
    function(callback)
    {
        res.redirect('#/app_details');
         callback(null);
        
    }
],
function(err,data){
    if(err!=null)
    {
        res.redirect('/admin/public/registration_error.html');  
    }
});  
    
}

module.exports.create_app=create_app;