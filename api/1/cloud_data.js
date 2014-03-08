/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var aws = require('aws-sdk');
var api_log = require('../misc/logging.js');
var datetime=require('../misc/datetime.js');
var s3_utils=require('../misc/s3_utils.js');

    
function read_user(bucket_file, callback)
{
    api_log.log("Reading user file: " + bucket_file);
    var s3 = new aws.S3();
    var params = {Bucket: 'mtrack-users', Key: bucket_file};

    s3.getObject(params, function(err, data) {}).
    on('success',function(response){
        callback(new user(response.data.Body.toString()));
    })
    .on('error',function(err){
        callback(null);
    });//.send();
}

function user(jsonStr)
{
    var json = JSON.parse(jsonStr);
    this.name = json['name'];
    this.apps = json['apps'];
    
    //api_log.log(this.apps.toString());
}

function hbeat(jsonStr)
{
    var json=JSON.parse(jsonStr);
    this.beat_count=json['beat_count'];
    this.day=datetime.getDayAsStr();
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
            callback("CANNOT_STORE_HBEcallbackAT");
        }
    });
    
}

function read_hbeat_today(app_id,callback)
{
    var s3 = new aws.S3();

    var hbeat_file_name=app_id+"-"+datetime.getDayAsStr();
    
    var params={Bucket:'mtrack-hbeat',Key:hbeat_file_name};
    
    s3.getObject(params,function(err,data){})
        .on('success',function(response){
            callback(new hbeat(response.data.Body.toString()));
        })
        .on('error',function(error){
            callback(null);
        });
}


module.exports.read_user = read_user;
module.exports.read_hbeat_today = read_hbeat_today;
module.exports.store_hbeat_today = store_hbeat_today;