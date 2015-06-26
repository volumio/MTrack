/*
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var api_log=require('./misc/logging.js');
var async=require('async');
var aws = require('aws-sdk');

aws.config.loadFromPath('./aws-credentials.json');
var dynamo = new aws.DynamoDB();

api_log.log("*********************************************");
api_log.log("*            Installation script            *");
api_log.log("*********************************************");

async.series([
    function(callback)
    {
        api_log.log("Creating users table");

        var tableName='mtrack-users';

        var params = {
            AttributeDefinitions: [ /* required */
                {
                    AttributeName: 'username', /* required */
                    AttributeType: 'S' /* required */
                }
                /* more items */
            ],
            KeySchema: [ /* required */
                {
                    AttributeName: 'username', /* required */
                    KeyType: 'HASH' /* required */
                },
                /* more items */
            ],
            ProvisionedThroughput: { /* required */
                ReadCapacityUnits: 1, /* required */
                WriteCapacityUnits: 1 /* required */
            },
            TableName: tableName
        };

        createTable(params, tableName,callback);

    },
        function(callback)
        {
            api_log.log("Creating applications table");

            var tableName='mtrack-apps';

            var params = {
                AttributeDefinitions: [ /* required */
                    {
                        AttributeName: 'app_id', /* required */
                        AttributeType: 'S' /* required */
                    }
                    /* more items */
                ],
                KeySchema: [ /* required */
                    {
                        AttributeName: 'app_id', /* required */
                        KeyType: 'HASH' /* required */
                    },
                    /* more items */
                ],
                ProvisionedThroughput: { /* required */
                    ReadCapacityUnits: 1, /* required */
                    WriteCapacityUnits: 1 /* required */
                },
                TableName: tableName
            };

            createTable(params, tableName,callback);

        },
        function(callback)
        {
            api_log.log("Creating hbeat table");

            var tableName='mtrack-hbeat';

            var params = {
                AttributeDefinitions: [ /* required */
                    {
                        AttributeName: 'app_id', /* required */
                        AttributeType: 'S' /* required */
                    },
                    {
                        AttributeName: 'day', /* required */
                        AttributeType: 'N' /* required */
                    }

                    /* more items */
                ],
                KeySchema: [ /* required */
                    {
                        AttributeName: 'app_id', /* required */
                        KeyType: 'HASH' /* required */
                    },
                    {
                        AttributeName: 'day', /* required */
                        KeyType: 'HASH' /* required */
                    }
                    /* more items */
                ],
                ProvisionedThroughput: { /* required */
                    ReadCapacityUnits: 1, /* required */
                    WriteCapacityUnits: 1 /* required */
                },
                TableName: tableName
            };

            createTable(params, tableName,callback);

        }




        /*
        function(callback)
        {

            api_log.log("Creating users registration table");
            install_buckets.create_bucket('mtrack-users-waiting-list',callback);
        },
        function(callback)
        {

            api_log.log("Creating applications table");
            install_buckets.create_bucket('mtrack-applications',callback);
        },
        function(callback)
        {

            api_log.log("Creating feedbacks table");
            install_buckets.create_bucket('mtrack-feedbacks',callback);
        },
        function(callback)
        {

            api_log.log("Creating Hearthbeat table");
            install_buckets.create_bucket('mtrack-hbeat',callback);
        }*/
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



function createTable(params,tableName,callback)
{
    dynamo.listTables({}, function(err, data) {
        if (err) callback(err);
        else
        {
            var exists=false;

            for(var name in data['TableNames'])
            {
                if(name==tableName)
                {
                    exists=true;
                    break;
                }
            }

            if(exists==false)
            {
                dynamo.createTable(params, function(err, data) {
                    if (err)
                    {
                        if(err['code']!='ResourceInUseException')
                            callback(err);
                        else callback();
                    }       // successful response
                    else callback();
                });
            } else callback();
        }
    });
}