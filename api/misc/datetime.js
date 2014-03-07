/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
function getDayAsStr()
{
    var today=new Date();
    return today.getDay()+"-"+today.getMonth()+"-"+today.getYear();
}

module.exports.getDayAsStr=getDayAsStr;

