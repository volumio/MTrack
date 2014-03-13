/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var express = require('express');

var app = express();
var http = require('http');
var passport = require('passport');
var passport_setup=require('./server/passport.js');
var express_setup=require('./server/express.js');

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.urlencoded()); // get information from html forms

	//app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: '0GqtOtD4SSrJ1MUXj0ffkXLTt0a9ujYCZF6hMLtqfX7W0LA2SVQ3jPouAwgGnSa0' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

});

passport_setup.setup_passport(passport);
express_setup.setup_express(app,passport);

http.createServer(app).listen(9080);
/*
var url= require("url");
var _s = require('underscore.string');
var api_log=require('./api/1/log.js');
var api_logging=require('./api/misc/logging.js');

var api_errors=require('./api/1/errors.js');
var aws=require('aws-sdk');
aws.config.loadFromPath('./aws-credentials.json');

api_logging.log("API running");

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

var apis=http.createServer(function(req, res) {
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
    else if(_s.startsWith(pathname,"/ui"))
    {
        proxy.web(req, res, { target: 'http://localhost:8000' });
    }
    else
    {
        api_errors.no_one_here(res);
    }
}).listen(9080, "");*/
