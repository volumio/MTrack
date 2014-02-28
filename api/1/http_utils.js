/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var api_log=require('../misc/logging.js');

function get_header(req,key) {
    for(var item in req.headers) {
        if(item==key)
        {
            api_log.log(item + ": " + req.headers[item]);
            return req.headers[item];
        }
      }
    
    return null;
}

module.exports.get_header=get_header;

