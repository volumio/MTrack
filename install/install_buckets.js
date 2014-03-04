/*
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var api_log = require('../api/misc/logging.js');
var aws = require('aws-sdk');
var fs = require('fs');

aws.config.loadFromPath('../aws-credentials.json');
var s3 = new aws.S3();
var bucket_list = [];

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

function put_file_on_bucket(bucket, key, file, callback)
{
    fs.readFile(file, function(err, data) {
        if (err)
            callback("CANNOT_PUT_OBJECT", file);
        else
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
                        callback("CANNOT_PUT_OBJECT", file);
                    });
        }
    });

}

// Functions which will be available to external callers
module.exports.create_bucket = create_bucket;
module.exports.list_buckets = list_buckets;
module.exports.put_file_on_bucket = put_file_on_bucket;