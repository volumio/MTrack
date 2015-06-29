/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var config=require('properties-reader')('/MTrack/config.properties');
var api_log=require('/MTrack/misc/logging.js');
api_log.init(config);

api_log.log("###########################");
api_log.log("        MTrack V"+config.get('VERSION'));
api_log.log(" by Massimiliano Fanciulli");
api_log.log("###########################");
api_log.log("");

// CONFIGURATION
var express = require('express');
var app = express();
var express_setup=require('/MTrack/api/1/server/express.js');
express_setup.setup_express(app);
api_log.log("Configuration completed");

// STARTUP
var port=config.get("PORT");
var http = require('http');
http.createServer(app).listen(port);
api_log.log("Listening on port "+port);
