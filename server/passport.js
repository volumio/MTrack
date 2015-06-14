/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var LocalStrategy = require('passport-local').Strategy;
var api_log = require('../api/misc/logging.js');
var data_model=require('../api/model/data_model.js');

var setup_passport = function(passport)
{
    var data_storage = require('./backend_config.js').get_data_storage();
    
    passport.use('local', new LocalStrategy(
            function(username, password, done) {
                 data_storage.read_user(username,function(user){
                      if(user!=null)
                     {
                         if(password==user['password'])
                         {
                             done(null,user);
                         }
                         else done(null, false, {message: 'Incorrect password.'});
                     }
                     else done(null, false, {message: 'Incorrect username.'});
                 });
            }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user['username']);
    });

    passport.deserializeUser(function(username, done) {
        var user=new data_model.user(username);
        
        done(null, user);
    });

}

module.exports.setup_passport = setup_passport;