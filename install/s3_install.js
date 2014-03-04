/*
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var api_log=require('../api/misc/logging.js');
var async=require('async');
var install_buckets=require('./install_buckets.js');

//Creating users bucket
async.series([
    function(callback)
    {
        install_buckets.list_buckets(callback);
    },
    function(callback)
    {
        install_buckets.create_bucket('mtrack-users',callback);
    },
    function(callback)
    {
        install_buckets.create_bucket('mtrack-applications',callback);
    },
    function(callback)
    {
        install_buckets.create_bucket('mtrack-feedbacks',callback);
    },
    function(callback)
    {
        install_buckets.put_file_on_bucket('mtrack-users','fanciulli@gmail.com','../aws_data/usr_fanciulli@gmail.com.json',callback);;
    }
],
function(err,data){
    if(err!=null)
    {
    if(err=='CANNOT_LIST')
        api_log.log("Cannot retrieve the buckets list");
    else if(err=="CANNOT_CREATE_BUCKET")
        api_log.log("Cannot create bucket "+err+". Details: "+data);
    else if(err=="CANNOT_PUT_OBJECT")
        api_log.log("Cannot put object "+data+" on S3");
    else api_log.log("Inernal error.");
}
});