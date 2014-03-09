/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var datetime=require('date-utils');

function getDayAsStr()
{
    var today=Date.today();
    return today.toFormat("DD-MM-YYYY");
}

module.exports.getDayAsStr=getDayAsStr;

