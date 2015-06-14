/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var config = require('./config.json');

function get_data_storage()
{
    var data_storage;
    
    if (config["data_storage"] == "AWS")
    {
        data_storage = require('../api/aws/data_storage.js');
    }
    
    return data_storage;
}

function get_email_service()
{
    var email_service;
    
    if (config["email_service"] == "AWS")
    {
        email_service = require('../api/aws/email_service.js');
    }
    
    return email_service;
}

function get_admin_email()
{
    return config['admin_email'];
}
module.exports.get_data_storage = get_data_storage;
module.exports.get_email_service=get_email_service;
module.exports.get_admin_email=get_admin_email;


