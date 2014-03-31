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
    var today=datetime.getTodayAsLong();
	    
    var params = {Key: {appId: {S: app_id},day:{N:today.toString()}},
                    TableName: 'mtrack-hbeat',ConsistentRead: true };

	dynamo.getItem(params, function(err, data) {
          if (err || data == null || typeof data.Item == "undefined") callback(null);
	  else    
          {
              var hbeat=new data_model.hbeat(app_id);
              hbeat.beat_count=parseInt(data.Item.beat_count.N);
              hbeat.day=data.Item.day.N;
              callback(hbeat);
          }
	});
    
}

function read_hbeat_month(app_id,callback)
{
    var stop=datetime.getNowAsLong();
    var start=datetime.getOneMonthAgoAsLong();
    
    var params = {TableName: 'mtrack-hbeat',
            AttributesToGet:['day','beat_count'],
            Select:'SPECIFIC_ATTRIBUTES',
            KeyConditions:{
                appId:{
                    ComparisonOperator:'EQ',
                    AttributeValueList:[{S:app_id}]
                },
                day:{
                    ComparisonOperator:'BETWEEN',
                    AttributeValueList:[{N:start.toString()},{N:stop.toString()}]
                }
            }
            };

	dynamo.query(params, function(err, data) {
          if (err!=null || data == null || typeof data.Items == "undefined") {
                callback(null);
          }
	  else    
          {
              var result={hbeats:[]};
              
              var items=data.Items;
              for(var i in items)
              {
                    var hbeat=new data_model.hbeat(app_id);
                    hbeat.beat_count=parseInt(items[i].beat_count.N);
                    hbeat.day=parseInt(items[i].day.N);
                    result.hbeats.push(hbeat);
              }
              
              callback(result);
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

function store_feedback(app_id,body,callback)
{
    var timestamp=datetime.getNowAsLong();
    
    var params = {Item: {id:{N:timestamp.toString()},
                         app_id: {S: app_id},
			    text:{S:body.text}},
			  TableName: 'mtrack-feedbacks'};

    if(typeof body.email!='undefined')
    {
        params.Item.email={S:body.email};
    }
    
    dynamo.putItem(params, function(err, data) {
        console.log(err);
	  if (err) callback("ERR_PUTTING_USER");
	  else    callback(null);
	});
    
}

function list_feedbacks(app_id,callback)
{
    var params = {TableName: 'mtrack-feedbacks',
            Select:'ALL_ATTRIBUTES',
            KeyConditions:{
                app_id:{
                    ComparisonOperator:'EQ',
                    AttributeValueList:[{S:app_id}]
            }}
            };

	dynamo.query(params, function(err, data) {
          if (err!=null || data == null || typeof data.Items == "undefined") {
                callback(null);
          }
	  else    
          {
              var result={feedbacks:[]};
              
              var items=data.Items;
              for(var i in items)
              {
                  
                    var feedback=new data_model.feedback(app_id);
                    feedback.id=items[i].id.N;
                    feedback.text=items[i].text.S;
                    
                    if(typeof items[i].email!='undefined')
                        feedback.email=items[i].email.S;
                    
                    result.feedbacks.push(feedback);
                    console.log(feedback);
                    
              }
              
              callback(result);
          }
	});
    
}

function delete_feedback(app_id,id,callback)
{
    var params = {TableName: 'mtrack-feedbacks',
            Key:{
                app_id:{S:app_id},
                id:{N:id}
            }};

	dynamo.deleteItem(params, function(err, data) {
            console.log(err);
                callback(err);
            });
    
}

function store_exception(app_id,body,callback)
{
    var timestamp=datetime.getNowAsLong();
   
    var params = {Item: {app_id: {S: app_id},
			             id:{N:timestamp.toString()},
                         exception:{S:body.exception},
                         os_type:{S:body.ostype},
                         os_version:{S:body.osversion}},
			  TableName: 'mtrack-exceptions'};
	dynamo.putItem(params, function(err, data) {
        console.log(err);
	  if (err) callback("ERR_PUTTING_EXCEPTION");
	  else    callback(null);
	});
}

function list_exception(app_id,callback)
{
    var params = {TableName: 'mtrack-exceptions',
            Select:'ALL_ATTRIBUTES',
            KeyConditions:{
                app_id:{
                    ComparisonOperator:'EQ',
                    AttributeValueList:[{S:app_id}]
            }}
            };

	dynamo.query(params, function(err, data) {
          if (err!=null || data == null || typeof data.Items == "undefined") {
                callback(null);
          }
	  else    
          {
              var result={exceptions:[]};
              
              var items=data.Items;
              for(var i in items)
              {
                  
                    var exception=new data_model.exception(app_id);
                    exception.id=items[i].id.N;
                    exception.exception=items[i].exception.S;
                    exception.os_type=items[i].os_type.S;
                    exception.os_version=items[i].os_version.S;
                     
                    result.exceptions.push(exception);
              }
              
              callback(result);
          }
	});
    
}

function delete_exception(app_id,id,callback)
{
    var params = {TableName: 'mtrack-exceptions',
            Key:{
                app_id:{S:app_id},
                id:{N:id}
            }};

	dynamo.deleteItem(params, function(err, data) {
            console.log(err);
                callback(err);
            });
    
}

module.exports.read_user = read_user;
module.exports.store_user=store_user;
module.exports.read_hbeat_today = read_hbeat_today;
module.exports.read_hbeat_month=read_hbeat_month;
module.exports.store_hbeat_today = store_hbeat_today;
module.exports.store_user_on_waiting_list=store_user_on_waiting_list;
module.exports.delete_user_from_waiting_list=delete_user_from_waiting_list;
module.exports.read_user_from_waiting_list=read_user_from_waiting_list;


module.exports.store_feedback=store_feedback;
module.exports.list_feedbacks=list_feedbacks;
module.exports.delete_feedback=delete_feedback;

module.exports.store_exception=store_exception;
module.exports.list_exception=list_exception;
module.exports.delete_exception=delete_exception;