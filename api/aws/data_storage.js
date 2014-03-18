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

aws.config.loadFromPath('./aws-credentials.json');
var dynamo = new aws.DynamoDB();
var async=require('async');
var datetime=require('../misc/datetime.js');

function read_user(username, callback)
{
    var params = {Key: {username: {S: username}},
                    TableName: 'mtrack-users',ConsistentRead: true };

	dynamo.getItem(params, function(err, data) {
	  if (err || data == null || typeof data.Item == "undefined") callback(null);
	  else    
          {
              var user=new data_model.user(data.Item.username.S);
              user.password=data.Item.password.S;
              user.fullname=data.Item.fullname.S;
              user.company=data.Item.company.S;
              callback(user);
          }
	});
}

function store_user(user,callback)
{
    var params = {Item: {username: {S: user.username},
			 password:{S:user.password},
                        fullname:{S:user.fullname},
                            company:{S:user.company}},
			  TableName: 'mtrack-users'};
	dynamo.putItem(params, function(err, data) {
	  if (err) callback("ERR_PUTTING_USER");
	  else    callback(null);
	});
}



function store_hbeat_today(hbeat,callback)
{
    var params = {Item: {beat_count: {N: hbeat.beat_count.toString()},
			 day:{N:hbeat.day.toString()},
                        appId:{S:hbeat.app_id}},
			  TableName: 'mtrack-hbeat'};
	dynamo.putItem(params, function(err, data) {
            console.log(err);
	  if (err) callback("ERR_PUTTING_USER");
	  else    callback(null);
	});
    
}

function read_hbeat_today(app_id,callback)
{
    var today=datetime.getNowAsLong();
    var params = {Key: {appId: {S: app_id},day:{N:today.toString()}},
                    TableName: 'mtrack-hbeat',ConsistentRead: true };

	dynamo.getItem(params, function(err, data) {
            console.log(err);
	  if (err || data == null || typeof data.Item == "undefined") callback(null);
	  else    
          {
              console.log(data.Item);
              var hbeat=new data_model.hbeat(app_id);
              hbeat.beat_count=parseInt(data.Item.beat_count.N);
              hbeat.day=data.Item.day.N;
              callback(hbeat);
          }
	});
    
}

function store_user_on_waiting_list(UUID,user,callback)
{
    var params = {Item: {UUID:{S:UUID},
                            username: {S: user.username},
			    password:{S:user.password},
                            fullname:{S:user.fullname},
                            company:{S:user.company}},
			  TableName: 'mtrack-users-waiting-list'};

	dynamo.putItem(params, function(err, data) {
	  if (err) callback("ERR_PUTTING_USER");
	  else    callback(null);
	});
        
}

function delete_user_from_waiting_list(id,callback)
{
    var params = {Key: {UUID: {S: id}},
                    TableName: 'mtrack-users-waiting-list' };
	dynamo.deleteItem(params, function(err, data) {
	    if (err!=null) callback("CANNOT_DELETE");
	  else    
          {
              callback(null);
          }
	});
}

function read_user_from_waiting_list(id,callback)
{
    var params = {Key: {UUID: {S: id}},
                    TableName: 'mtrack-users-waiting-list',ConsistentRead: true };

	dynamo.getItem(params, function(err, data) {
	  if (err || data == null || typeof data.Item == "undefined") callback(null);
	  else    
          {
              var user=new data_model.user_waiting_list(id,data.Item.username.S);
              user.user.password=data.Item.password.S;
              user.user.fullname=data.Item.fullname.S;
              user.user.company=data.Item.company.S;
              callback(user);
          }
	});
}

function store_feedback(app_id,feedback,callback)
{
    var file_name=app_id+"-"+datetime.getDayAsStr();
    
    s3_utils.put_json_on_bucket('mtrack-feedbacks',file_name,feedback,function(err,data){
        if(err==null)
            callback(null); 
        else 
        {
            callback("CANNOT_STORE_FEEDBACK");
        }
    });
    
}
module.exports.read_user = read_user;
module.exports.store_user=store_user;
module.exports.read_hbeat_today = read_hbeat_today;
module.exports.store_hbeat_today = store_hbeat_today;
module.exports.store_user_on_waiting_list=store_user_on_waiting_list;
module.exports.delete_user_from_waiting_list=delete_user_from_waiting_list;
module.exports.read_user_from_waiting_list=read_user_from_waiting_list;
module.exports.store_feedback=store_feedback;
