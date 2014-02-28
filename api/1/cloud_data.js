/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var aws = require('aws-sdk');
var api_log = require('../misc/logging.js');

function read_user(bucket_file, callback)
{
    api_log.log("Reading user file: " + bucket_file);
    var s3 = new aws.S3();
    var params = {Bucket: 'mtrack', Key: bucket_file};

    s3.getObject(params, function(err, data) {}).
    on('success',function(response){
        callback(new user(response.data.Body.toString()));
    });//.send();
}

function user(jsonStr)
{
    var json = JSON.parse(jsonStr);
    this.name = json['name'];
    this.apps = json['apps'];
    
    //api_log.log(this.apps.toString());
}
module.exports.read_user = read_user;