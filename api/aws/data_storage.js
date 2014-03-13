/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var aws = require('aws-sdk');
var api_log = require('../misc/logging.js');
var datetime=require('../misc/datetime.js');
var s3_utils=require('./s3_utils.js');
var data_model=require('../model/data_model.js');

function read_user(username, callback)
{
    var s3 = new aws.S3();
    var params = {Bucket: 'mtrack-users', Key: username};

    s3.getObject(params, function(err, data) {}).
    on('success',function(response){
        callback(JSON.parse(response.data.Body.toString()));
    })
    .on('error',function(err){
        callback(null);
    });//.send();
}

function store_hbeat_today(app_id,hbeat,callback)
{
    var s3 = new aws.S3();

    var hbeat_file_name=app_id+"-"+datetime.getDayAsStr();
    
    s3_utils.put_json_on_bucket('mtrack-hbeat',hbeat_file_name,hbeat,function(err,data){
        if(err==null)
            callback(null); 
        else 
        {
            callback("CANNOT_STORE_HBEAT");
        }
    });
    
}

function read_hbeat_today(app_id,callback)
{
    var s3 = new aws.S3();

    var hbeat_file_name=app_id+"-"+datetime.getDayAsStr();
    api_log.log("Getting hbeat "+hbeat_file_name);
    
    s3_utils.get_json_from_bucket('mtrack-hbeat',hbeat_file_name,callback);
}

function store_user_on_waiting_list(UUID,user,callback)
{
    s3_utils.put_json_on_bucket('mtrack-users-waiting-list',UUID,user,callback);
}

module.exports.read_user = read_user;
module.exports.read_hbeat_today = read_hbeat_today;
module.exports.store_hbeat_today = store_hbeat_today;
module.exports.store_user_on_waiting_list=store_user_on_waiting_list;
