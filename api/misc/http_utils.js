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
            return req.headers[item];
        }
      }
}

module.exports.get_header=get_header;

