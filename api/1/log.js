/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var url= require("url");
var _s = require('underscore.string');
var api_auth=require('./auth.js');
var api_errors=require('./errors.js');
var cloud_data=require('./cloud_data.js');
var api_log=require('../misc/logging.js');

function log(req,res) {
    var user_name=api_auth.passes_auth(req);
    var pathname = url.parse(req.url).pathname;
    
    api_log.log("Reading data from bucket "+user_name);
    if(user_name!=null)
    {
        var body='';
        req.on('data', function(chunk) {
            body+=chunk;
        })
        req.on('end',function(){
            var usr=cloud_data.read_user(user_name+'.json', function(user){
                api_log.log("The following user has been read: "+user.name);
                if(user!=null)
                {
                    var app_id=pathname.substring(pathname.lastIndexOf("/")+1);
                    
                    var app_found=false;
                    for(var app in user.apps)
                    {
                        if(app==app_id)
                        {
                            app_found=true;
                        }
                    }    
                    
                    if(app_found)
                        res.end();
                    else api_errors.no_app(res);
                    
                }
                else api_errors.internal_error(res);
            })
            
        })
    }
    else
    {
        api_errors.no_auth(res);
    }
}

module.exports.log=log;

