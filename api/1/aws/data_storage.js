/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var aws = require('aws-sdk');
aws.config.loadFromPath(__dirname+'/../conf/aws-credentials.json');
var dynamo = new aws.DynamoDB();

var data_model=require('../model/data_model.js');
var datetime=require('../misc/datetime.js');

function store_hbeat_today(hbeat,callback)
{
    var params = {Item: {beat_count: {N: hbeat.beat_count.toString()},
			            day:{N:hbeat.day.toString()},
                        app_id:{S:hbeat.app_id}},
			  TableName: 'mtrack-hbeat'};
                      
    if(typeof hbeat.locale != 'undefined')
        params.Item.locale={S:JSON.stringify(hbeat.locale)};
    
    if(typeof hbeat.osversion != 'undefined')
        params.Item.osversion={S:JSON.stringify(hbeat.osversion)};
    
    if(typeof hbeat.appversion != 'undefined')
        params.Item.appversion={S:JSON.stringify(hbeat.appversion)};

    if(typeof hbeat.uids != 'undefined')
        params.Item.uids={S:JSON.stringify(hbeat.uids)};
    
	dynamo.putItem(params, function(err, data) {
      if (err) callback("ERR_PUTTING_USER");
	  else    callback(null);
	});
    
}

function read_hbeat_today(app_id,callback)
{
    var today=datetime.getTodayAsLong();
	    
    var params = {Key: {app_id: {S: app_id},day:{N:today.toString()}},
                    TableName: 'mtrack-hbeat',ConsistentRead: true };

	dynamo.getItem(params, function(err, data) {
      if (err || data == null || typeof data.Item == "undefined") callback(null);
	  else    
          {
              var hbeat=new data_model.hbeat(app_id);
              hbeat.beat_count=parseInt(data.Item.beat_count.N);
              hbeat.day=data.Item.day.N;
              
              if(typeof data.Item.locale != 'undefined')
                  hbeat.locale=JSON.parse(data.Item.locale.S);
              
              if(typeof data.Item.osversion != 'undefined')
                  hbeat.osversion=JSON.parse(data.Item.osversion.S);
              
              if(typeof data.Item.appversion != 'undefined')
                  hbeat.appversion=JSON.parse(data.Item.appversion.S);

              if(typeof data.Item.uids != 'undefined')
                  hbeat.uids=JSON.parse(data.Item.uids.S);
              
              callback(hbeat);
          }
	});
    
}

function read_hbeat_month(app_id,callback)
{
    var stop=datetime.getNowAsLong();
    var start=datetime.getOneMonthAgoAsLong();
    
    var params = {TableName: 'mtrack-hbeat',
            AttributesToGet:['day','beat_count','locale','osversion','appversion'],
            Select:'SPECIFIC_ATTRIBUTES',
            KeyConditions:{
                app_id:{
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
                    
                    if(typeof items[i].locale != 'undefined')
                        hbeat.locale=JSON.parse(items[i].locale.S);
              
                    if(typeof items[i].osversion != 'undefined')
                        hbeat.osversion=JSON.parse(items[i].osversion.S);
                    
                    if(typeof items[i].appversion != 'undefined')
                        hbeat.appversion=JSON.parse(items[i].appversion.S);
              
                    result.hbeats.push(hbeat);
              }
              
              callback(result);
          }
	});
    
}


module.exports.read_hbeat_today = read_hbeat_today;
module.exports.read_hbeat_month=read_hbeat_month;
module.exports.store_hbeat_today = store_hbeat_today;
