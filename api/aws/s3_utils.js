/*
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var api_log = require('../misc/logging.js');
var aws = require('aws-sdk');
var fs = require('fs');

var bucket_list = [];

aws.config.loadFromPath('./aws-credentials.json');
var s3 = new aws.S3();

function create_bucket(name, callback)
{
    if (bucket_list.indexOf(name) == -1)
    {
        api_log.log("Creating bucket " + name + " on S3");
        s3.createBucket({Bucket: name, CreateBucketConfiguration: {LocationConstraint: "us-west-2"}}, function(err, data) {
        })
                .on('success', function(response) {
                    callback(null, null);
                })
                .on('error', function(response) {
                    callback("CANNOT_CREATE_BUCKET", response);
                });
    }
    else
    {
        api_log.log("Bucket " + name + " already created. Skipping.");
        callback(null, null);
    }
}

function list_buckets(callback)
{
    s3.listBuckets({}, function(err, data) {
    })
            .on('success', function(response) {
                for (var buck in response.data.Buckets)
                    bucket_list.push(response.data.Buckets[buck].Name);

                callback(null, null);
            })
            .on('error', function(response) {
                callback("CANNOT_LIST", null);
            });
}

function put_data_on_bucket(bucket, key, data, callback)
{
    var base64data = new Buffer(data, 'binary');
    s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: base64data
    }, function(err, data) {
    })
            .on('success', function(response)
            {
                callback(null, null);
            })
            .on('error', function(response) {
                callback("CANNOT_PUT_OBJECT");
            });
            
}

function put_json_on_bucket(bucket, key, json, callback)
{
    s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(json)
    }, function() {
        
    })
            .on('success', function(response)
            {
                callback(null, null);
            })
            .on('error', function(response) {
                api_log.log("FAILURE");
                callback("CANNOT_PUT_OBJECT",null);
            });
            
}


function put_file_on_bucket(bucket, key, file, callback)
{
    fs.readFile(file, function(err, data) {
        if (err)
            callback("CANNOT_PUT_OBJECT", file);
        else
        {
            put_data_on_bucket(bucket,key,data,callback);
        }
    });

}


function get_json_from_bucket(bucket,key,callback)
{
    var params = {Bucket: bucket, Key: key};

    s3.getObject(params, function(err, data) {}).
    on('success',function(response){
        callback(JSON.parse(response.data.Body.toString()));
    })
    .on('error',function(err){
        callback(null);
    });
}

function delete_from_bucket(bucket, key, callback)
{
    var params = {Bucket: bucket, Key: key};

    s3.deleteObject(params,function(err, data) {}).
    on('success',function(response){
        callback(null);
    })
    .on('error',function(err){
        callback(err);
    });

}

// Functions which will be available to external callers
module.exports.create_bucket = create_bucket;
module.exports.list_buckets = list_buckets;
module.exports.put_file_on_bucket = put_file_on_bucket;
module.exports.put_data_on_bucket=put_data_on_bucket;
module.exports.put_json_on_bucket=put_json_on_bucket;
module.exports.get_json_from_bucket=get_json_from_bucket;
module.exports.delete_from_bucket=delete_from_bucket;