/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var api_hbeat=require('../hbeat.js');

var body_parser=require('body-parser');

var setup_express = function(app, passport)
{
    app.use(body_parser.json());

    app.get('/api/1/hbeat/:appId/today', api_hbeat.get_today);
    app.get('/api/1/hbeat/:appId/month', api_hbeat.get_month);
    app.post('/api/1/hbeat/:appId', api_hbeat.store_today);

    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.send(500, 'Unexpected error');
    });
    
}

module.exports.setup_express = setup_express;