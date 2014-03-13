/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */

function user(jsonStr)
{
    var json = JSON.parse(jsonStr);
    this.name = json['name'];
    this.password=json['password'];
    this.apps = json['apps'];
    
    //api_log.log(this.apps.toString());
}

function hbeat(json)
{
    this.beat_count=json['beat_count'];
    this.day=datetime.getDayAsStr();
}

module.exports.hbeat=hbeat;
module.exports.user=user;