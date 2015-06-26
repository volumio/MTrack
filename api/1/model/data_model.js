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
    this.apps=[];
}

function app(id)
{
    this.app_id=id;
}

function hbeat(app_id)
{
    this.app_id=app_id;
    this.beat_count=0;
    this.day=datetime.getTodayAsLong();
}

module.exports.hbeat=hbeat;
module.exports.user=user;
module.exports.app=app;
