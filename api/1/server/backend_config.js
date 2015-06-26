/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */

function get_data_storage()
{
    return require('../aws/data_storage.js');
}

module.exports.get_data_storage = get_data_storage;


