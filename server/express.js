/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var express = require('express');

var api_hbeat=require('../api/1/hbeat.js');
var api_feedback=require('../api/1/feedback.js');
var api_exceptions=require('../api/1/exceptions.js');
var api_logging=require('../api/misc/logging.js');
var registration=require('../admin/registration.js');
var app_man=require('../admin/app_management.js');
var user_man=require('../admin/user_management.js');

var setup_express = function(app, passport)
{
    app.get('/api/1/hbeat/:appId/today', api_hbeat.get_today);
    app.get('/api/1/hbeat/:appId/month', api_hbeat.get_month);
    app.post('/api/1/hbeat/:appId', api_hbeat.store_today);
    
    app.post('/api/1/feedback/:appId', api_feedback.store_feedback);
    app.get('/api/1/feedback/:appId', api_feedback.list_feedbacks);
    app.delete('/api/1/feedback/:appId/:id', api_feedback.delete_feedback);
    
    app.post('/api/1/exceptions/:appId', api_exceptions.store_exception);
    app.get('/api/1/exceptions/:appId', api_exceptions.list_exceptions);
    app.delete('/api/1/exceptions/:appId/:id', api_exceptions.delete_exception);
    
    
    app.post('/login', passport.authenticate('local', {successRedirect: '/admin/private/index.html', failureRedirect: '/admin/public/login.html'}));
    app.post('/register', registration.process_registration);
    app.get('/activate/:userId',registration.activate_user);
    
    app.post('/admin/create_app', ensureAuthenticated,app_man.create_app);
    app.get('/admin/user', ensureAuthenticated,user_man.get_user);
    app.get('/admin/app/:appId', ensureAuthenticated,user_man.get_app);
    
    app.use('/admin/private/*', ensureAuthenticated, express.static(__dirname + '/../ui/private'));
    /* app.use('/admin/private/*', passport.authenticate('local'), express.static(__dirname + '/../ui/private'));*/
    app.use('/admin', express.static(__dirname + '/../ui'));
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.send(500, 'Unexpected error');
    });
    
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/admin/public/login.html');
}
//, {failureRedirect: '/admin/login.html'}
module.exports.setup_express = setup_express;