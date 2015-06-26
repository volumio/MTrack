/*
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var logger;

function init(config)
{
    logger = require('winston');

    if(config.get('LOGGING_TYPE')=='FILE')
    {
        logger.add(logger.transports.File, { json:false,filename: config.get('LOGGING_FILE_FULL_PATH') });
        logger.remove(logger.transports.Console);
    }
}

function log(text)
{
    logger.info(text);
}

module.exports.init=init;
module.exports.log=log;
