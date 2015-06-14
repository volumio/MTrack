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

function getTodayAsLong()
{
    var day=moment();
    day.hour(0);
    day.minute(0);
    day.second(0);
    day.millisecond(0);
    return day.valueOf();
}

function getNowAsLong()
{
    var day=moment();
    return day.valueOf();
}

function getOneMonthAgoAsLong()
{
    var day=moment();
    day.subtract('months', 1);
    return day.valueOf();
}

function getAsDayMonth(timestamp)
{
    var time=new moment(timestamp);
    return time.format("DD/MM");
}

module.exports.getDayAsStr=getDayAsStr;
module.exports.getTodayAsLong=getTodayAsLong;
module.exports.getNowAsLong=getNowAsLong;
module.exports.getOneMonthAgoAsLong=getOneMonthAgoAsLong;