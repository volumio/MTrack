/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var api_log=require('../misc/logging.js');
var api_errors = require('./errors.js');

var data_storage = require('../../server/backend_config.js').get_data_storage();

function store_feedback(req,res) {
   if (req.params.appId !== undefined)
    {
        data_storage.store_feedback(req.params.appId, req.body, function(err)
        {
            if (err == null)
                res.end();
            else api_errors.internal_error(res);
        });
    }
    else res.send(400, 'AppID should be specified');
}

function read_feedbacks(req,res)
{
    if (req.params.appId !== undefined)
    {
        data_storage.read_feedbacks(req.params.appId,  function(data)
        {
            var data_to_upload;

            if (data == null)
            {
                data_to_upload = {};

            }
            else
                data_to_upload = data;

            res.json(data_to_upload);
        });
    }
    else res.send(400, 'AppID should be specified');
}

function delete_feedback(req,res)
{
    if (req.params.appId !== undefined && req.params.id !== undefined)
    {
        data_storage.delete_feedback(req.params.appId, req.params.id, function(err)
        {
            if(err==null)
                res.end();
            else api_errors.internal_error(res);
        });
    }
    else res.send(400, 'AppID should be specified');
}

module.exports.store_feedback=store_feedback;
module.exports.read_feedbacks=read_feedbacks;
module.exports.delete_feedback=delete_feedback;

