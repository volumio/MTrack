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
var api_log=require('./api/misc/logging.js');

var port=9080;

var morgan=require('morgan');
var cookieParser=require('cookie-parser');
var session=require('express-session');


api_log.log("MTrack booting up");

/*app.configure(function() {

	// set up our express application
	//app.use(express.logger('dev')); // log every request to the console
	//app.use(express.cookieParser()); // read cookies (needed for auth)
	//app.use(express.urlencoded()); // get information from html forms
    //    app.use(express.json());
	//app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	//app.use(express.session({ secret: '0GqtOtD4SSrJ1MUXj0ffkXLTt0a9ujYCZF6hMLtqfX7W0LA2SVQ3jPouAwgGnSa0' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

});*/

passport_setup.setup_passport(passport);
express_setup.setup_express(app,passport);
api_log.log("Configuration completed");

http.createServer(app).listen(port);
api_log.log("Listening on port "+port);