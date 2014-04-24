/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var async = require('async');
var config = require('../server/backend_config.js');
//var email_service =config.get_email_service();
var storage_service = config.get_data_storage();
var datetime = require('../api/misc/datetime.js');
var data_model = require('../api/model/data_model.js');
var async = require('async');

function get_user(req, res) {
    var username = req.user.username;
    storage_service.read_user(username, function(data)
    {
        if (data != null)
            res.json(data);
        else
            res.end();
    });
}


function get_app(req, res)
{
    storage_service.read_app(req.params.appId, function(data)
    {
        if (data != null)
            res.json(data);
        else
            res.end();
    });
}

function delete_app(req,res)
{
    storage_service.delete_app(req.params.appId,function(err){
        if(err==null)
            res.end();
        else res.send(500);
    });
}

module.exports.get_user = get_user;
module.exports.get_app = get_app;
module.exports.delete_app = delete_app;