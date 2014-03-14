/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var express = require('express');

var api_hbeat=require('../api/1/hbeat.js');
var api_logging=require('../api/misc/logging.js');
var registration=require('../admin/registration.js');

var setup_express = function(app, passport)
{
    app.get('/api/1/hbeat/:appId/today', api_hbeat.get_today);
    app.post('/api/1/hbeat/:appId', api_hbeat.store_today);
    app.post('/login', passport.authenticate('local', {successRedirect: '/admin/private/index.html', failureRedirect: '/admin/login.html'}));
    app.post('/register', registration.process_registration);
    app.get('/activate/:userId',registration.activate_user);
    
    app.use('/admin/private/*', passport.authenticate('local'), express.static(__dirname + '/../ui/private'));
    app.use('/admin', express.static(__dirname + '/../ui'));
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.send(500, 'Unexpected error');
    });
    
}
//, {failureRedirect: '/admin/login.html'}
module.exports.setup_express = setup_express;