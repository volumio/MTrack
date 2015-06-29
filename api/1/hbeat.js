/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var url = require("url");
var async = require('async');

var api_errors = require('./errors.js');
var api_log = require('./../../misc/logging.js');

var data_model=require('./model/data_model.js');
var data_storage = require('./server/backend_config.js').get_data_storage();


function store_today(req, res) {
    var app_id=req.params.appId;
    if (app_id !== undefined)
    {
        data_storage.read_hbeat_today(app_id, function(beat) {

            var data_to_upload;
            if (beat == null)
            {
                data_to_upload = new data_model.hbeat(app_id);
            }
            else data_to_upload = beat;

            data_to_upload.beat_count = data_to_upload.beat_count + 1;

            if(typeof req.body != 'undefined')
            {
                if(typeof req.body.uid !='undefined')
                {
                    if(data_to_upload.uids!=undefined)
                    {
                        if(data_to_upload.uids.indexOf(req.body.uid)>-1)
                        {
                            res.send(200, 'HeartBeat already sent for today');
                            return;
                        }
                        else data_to_upload.uids.push(req.body.uid);
                    }
                    else
                    {
                        data_to_upload.uids=[];
                        data_to_upload.uids.push(req.body.uid);
                    }
                }

                if(typeof req.body.locale !='undefined')
                {
                    var locale=req.body.locale;
                    var locale_array;
                    
                    if(typeof data_to_upload.locale != 'undefined')
                    {
                        locale_array=data_to_upload.locale;
                    }
                    else locale_array={};
                    
                    var count=0;
                    if(typeof locale_array[locale]!='undefined')
                    {
                        count=locale_array[locale];
                    }
                    
                    count=count+1;
                    locale_array[locale]=count;
                    
                    data_to_upload.locale=locale_array;
                }
                
                if(typeof req.body.osversion !='undefined')
                {
                    var osversion=req.body.osversion;
                    var osversion_array;
                    
                    if(typeof data_to_upload.osversion != 'undefined')
                    {
                        osversion_array=data_to_upload.osversion;
                    }
                    else osversion_array={};
                    
                    var count=0;
                    if(typeof osversion_array[osversion]!='undefined')
                    {
                        count=osversion_array[osversion];
                    }
                    
                    count=count+1;
                    osversion_array[osversion]=count;
                    
                    data_to_upload.osversion=osversion_array;
                }
                
                if(typeof req.body.appversion !='undefined')
                {
                    var appversion=req.body.appversion;
                    var appversion_array;
                    
                    if(typeof data_to_upload.appversion != 'undefined')
                    {
                        appversion_array=data_to_upload.appversion;
                    }
                    else appversion_array={};
                    
                    var count=0;
                    if(typeof appversion_array[appversion]!='undefined')
                    {
                        count=appversion_array[appversion];
                    }
                    
                    count=count+1;
                    appversion_array[appversion]=count;
                    
                    data_to_upload.appversion=appversion_array;
                }
            }

            data_storage.store_hbeat_today( data_to_upload, function(err)
            {
                if (err == null)
                    res.end();
                else
                {
                    console.log(err);
                    api_errors.internal_error(res);
                }

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
            var data_to_upload;

            if (beat == null)
            {
                data_to_upload = {'beat_count': 0};

            }
            else data_to_upload = beat;

            res.json(data_to_upload);
        });
    }
    else res.send(400, 'AppID should be specified');
}

function get_month(req, res)
{
    if (req.params.appId !== undefined)
    {
        data_storage.read_hbeat_month(req.params.appId, function(beat) {
            
            var data_to_upload;

            if (beat == null)
            {
                data_to_upload = {};

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
module.exports.get_month=get_month;

