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
var fs=require('fs');

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
        var content=get_content(user,req,UUID);
        api_log.log(content);
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

function get_content(user,req,UUID)
{
    var email=fs.readFileSync(__dirname+'/email_pre.html');
    email+="<h1>Account activation request</h1>"+
                "<p>The following user registered:</p>"+
                "<p>Username: "+user['username']+"</p>"+
                "<p>Password: "+user['password']+"</p>"+
                "<p>Full name: "+user['fullname']+"</p>"+
                "<p>Society: "+user['company']+"</p>"+
                "<table><tr>To activate click on the button:</tr><tr>"+
		"<td class=\"padding\"><p><a href=\"http://"+req.headers.host+"/activate/"+UUID+"\" class=\"btn-primary\">Activate user</a></p>"+
		"</td><tr></table>";
        
    email+=fs.readFileSync(__dirname+'/email_post.html');
    
    return email;
}

function activate_user(req,res)
{
    var user;
    var userId=req.params.userId;
    
    async.series([
    function(callback)
    {
      storage_service.read_user_from_waiting_list(userId,function(data)
      {
          if(data!=null)
          {
              user=data.user;
              callback(null);
          }
          else callback("NO_USER");
      });
    },
    function(callback)
    {
        storage_service.store_user(user,callback);
    },
    function(callback)
    {
        email_service.sendAccountActiveToUser(user.username,get_account_active_content(req),callback);
    },
    function(callback)
    {
        storage_service.delete_user_from_waiting_list(userId,callback);  
    },
    function(callback)
    {
        res.redirect('/admin/public/user_active.html');
    }
],
function(err,data){
    if(err!=null)
    {
        res.redirect('/admin/public/user_activation_error.html');  
    }
});
}

function get_account_active_content(req)
{
    var email=fs.readFileSync(__dirname+'/email_pre.html');
    email+="<h1>Yay!</h1>"+
                "<p>Your account is now active!</p>"+
                "<table><tr>"+
		"<td class=\"padding\"><p><a href=\"http://"+req.headers.host+"/admin/public/index.html"+"\" class=\"btn-primary\">Login</a></p>"+
		"</td><tr></table>";
        
    email+=fs.readFileSync(__dirname+'/email_post.html');
    
    return email;
}

module.exports.process_registration=process_registration;
module.exports.activate_user=activate_user;