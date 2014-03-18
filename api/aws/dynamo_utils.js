/*
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var aws = require('aws-sdk');

aws.config.loadFromPath('./aws-credentials.json');
var dynamo = new aws.DynamoDB();

function put_json()
{
	var params = {Item: {
			    username: {
			      S: 'fanciulli@gmail.com'
			    },
			    password:{S:'powd'}
			  },
			  TableName: 'mtrack-users'};

	dynamo.putItem(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
}

function read_json()
{
	var params = {Key: {
			    username: {
			      S: 'fanciulli@gmail.com'
			    }
			  },
			  TableName: 'mtrack-users',ConsistentRead: true };

	dynamo.getItem(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
}

// Functions which will be available to external callers
module.exports.put_json = put_json;
module.exports.read_json = read_json;
