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
        console.log(req.body);
        data_storage.store_feedback(req.params.appId, req.body, function(err)
        {
            if (err == null)
                res.end();
            else api_errors.internal_error(res);
        });
    }
    else res.send(400, 'AppID should be specified');
}

module.exports.store_feedback=store_feedback;

