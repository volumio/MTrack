/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var url = require("url");
var _s = require('underscore.string');
var api_auth = require('./auth.js');
var api_errors = require('./errors.js');
var api_log = require('../misc/logging.js');
var async = require('async');
var datetime = require('../misc/datetime.js');

var data_storage = require('../../server/backend_config.js').get_data_storage();


function store_today(req, res) {
    if (req.params.appId !== undefined)
    {
        data_storage.read_hbeat_today(req.params.appId, function(beat) {

            var data_to_upload;

            if (beat == null)
            {
                data_to_upload = {'beat_count': 0, 'day': '0'};
                data_to_upload["day"] = datetime.getDayAsStr();

            }
            else data_to_upload = beat;

            data_to_upload.beat_count = data_to_upload.beat_count + 1;

            data_storage.store_hbeat_today(req.params.appId, data_to_upload, function(err)
            {
                if (err == null)
                    res.end();
                else
                    api_errors.internal_error(res);
            });
        });
    }
    else
        res.send(400, 'AppID should be specified');
}

function get_today(req, res)
{
    if (req.params.appId !== undefined)
    {
        data_storage.read_hbeat_today(req.params.appId, function(beat) {
            api_log.log("Callbacked value " + beat);

            var data_to_upload;

            if (beat == null)
            {
                data_to_upload = {'beat_count': 0};

            }
            else
                data_to_upload = beat;

            res.json(data_to_upload);
        });
    }
    else res.send(400, 'AppID should be specified');
}


module.exports.store_today = store_today;
module.exports.get_today = get_today;

