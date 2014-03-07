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
var async=require('async');
var datetime=require('../misc/datetime.js');

function hbeat(req,res) {
    var user_name=api_auth.passes_auth(req);
    var pathname = url.parse(req.url).pathname;
    
    if(user_name!=null)
    {
        var body='';
        req.on('data', function(chunk) {
            body+=chunk;
        })
        req.on('end',function(){
            var usr;
            
            var app_id=pathname.substring(pathname.lastIndexOf("/")+1);
                    
            cloud_data.read_hbeat(app_id, function(beat){
                
                var data_to_upload;
                
                if(beat==null)
                {
                    data_to_upload={'beat_count':0,'day':'0'};
                    data_to_upload["day"]=datetime.getDayAsStr();
                    
                }
                else data_to_upload=beat;
                
                data_to_upload.beat_count=data_to_upload.beat_count+1;
                
                cloud_data.store_hbeat(app_id,data_to_upload,function(err)
                {
                    if(err==null)
                        res.end();
                    else api_errors.internal_error(res);
                });
            });
            
        })
    }
    else
    {
        api_errors.no_auth(res);
    }
}

module.exports.hbeat=hbeat;

