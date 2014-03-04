/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var auth_token="0GqtOtD4SSrJ1MUXj0ffkXLTt0a9ujYCZF6hMLtqfX7W0LA2SVQ3jPouAwgGnSa0";
var api_log=require('../misc/logging.js');
var api_http_utils=require('../misc/http_utils.js');

function passes_auth(req) {
    var header=api_http_utils.get_header(req,"authorization");
    
    if(header!=null)
    {
        return get_user_from_token(header);
    }
    else return null;
}

function get_user_from_token(token)
{
    if(token==auth_token)
    {
        return "usr_fanciulli@gmail.com"
    }
    else return null;
}

module.exports.passes_auth=passes_auth;

