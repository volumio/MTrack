/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var async=require('async');
var config=require('../server/backend_config.js');
//var email_service =config.get_email_service();
var storage_service=config.get_data_storage();
var datetime=require('../api/misc/datetime.js');
var data_model=require('../api/model/data_model.js');

function create_app(req, res) {
    var username=req.user.username;   
    var user;
    var app_id=datetime.getNowAsLong();
    var app;
    
async.series([
    function(callback)
    {
        storage_service.read_user(username,function(data){
            console.log(data);
            
            if(data!=null)
            {
                user=data;
                callback(null);
            }
            else callback("CANNOT_READ_USER");
        });
    },
    function(callback)
    {
        app=new data_model.app(app_id);
        app.username=username;
        app.name=req.body.name;
        
        storage_service.store_app(app,callback);
    },
    function(callback)
    {
        user.apps.push(app_id.toString());
        storage_service.store_user(user,callback);
    },
    function(callback)
    {
        res.redirect('/admin/private/index.html#/app_details/'+app_id);
         callback(null);
    }
],
function(err,data){
    if(err!=null)
    {
        console.log(err);
        res.redirect('/admin/public/registration_error.html');  
    }
});  
    
}

module.exports.create_app=create_app;