/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var http = require('http');
var url= require("url");
var _s = require('underscore.string');
var api_log=require('./api/1/log.js');
var api_logging=require('./api/misc/logging.js');
var api_hbeat=require('./api/1/hbeat.js');
var api_errors=require('./api/1/errors.js');
var aws=require('aws-sdk');

api_logging.log("API running");

var apis=http.createServer(function(req, res) {
    aws.config.loadFromPath('./aws-credentials.json');
    //Checking that request is for /api/<version>
    var pathname = url.parse(req.url).pathname;    
    if(_s.startsWith(pathname,"/api/1"))
    {
        if(req.method=='POST')
        {
            if(_s.startsWith(pathname,"/api/1/log"))
                api_log.log(req,res);
            else if(_s.startsWith(pathname,"/api/1/hbeat"))
                api_hbeat.store_today(req,res);
            else api_errors.no_one_here(res);
        }
        else if(req.method=='GET')
        {
            if(_s.startsWith(pathname,"/api/1/hbeat") && _s.endsWith(pathname,"/today"))
                api_hbeat.get_today(req,res);
            else api_errors.no_one_here(res);
        }
        else 
        {
            api_errors.no_one_here(res);
        }
        
        res.writeHead(200, {
        'Content-Type': 'text/plain; charset=UTF-8'
        });
    }
    else
    {
        api_errors.no_one_here(res);
    }
}).listen(9080, "");
