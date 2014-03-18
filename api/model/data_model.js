/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var datetime=require('../misc/datetime.js');
function user(username)
{
    this.username = username;
    this.password="";
    this.fullname="";
    this.company="";
}

function user_waiting_list(UUID,username)
{
    this.UUID = UUID;
    this.user=new user(username);
}

function hbeat(app_id)
{
    this.app_id=app_id;
    this.beat_count=0;
    this.day=datetime.getNowAsLong();
}

module.exports.hbeat=hbeat;
module.exports.user=user;
module.exports.user_waiting_list=user_waiting_list;