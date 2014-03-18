/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var datetime=require('date-utils');
var moment=require('moment');

function getDayAsStr()
{
    var today=Date.today();
    return today.toFormat("DD-MM-YYYY");
}

function getNow()
{
    var today=Date.today();
    return today.toFormat("DD-MM-YYYY");
}

function getNowAsLong()
{
    var day=moment();
    day.hour(0);
    day.minute(0);
    day.second(0);
    day.millisecond(0);
    return day.valueOf();
}
module.exports.getDayAsStr=getDayAsStr;
module.exports.getNowAsLong=getNowAsLong;
