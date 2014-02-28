/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
function no_one_here(res) {
    res.statusCode=400;
    res.end('None is listening here!');
}

function no_auth(res) {
    res.statusCode=401;
    res.end('');
}

function internal_error(res)
{
    res.statusCode=500;
    res.end('An error occurred processing your request');
}

function no_app(res)
{
    res.statusCode=500;
    res.end('The app is not associated to your account');
}

module.exports.no_one_here=no_one_here;
module.exports.no_auth=no_auth;
module.exports.internal_error=internal_error;
module.exports.no_app=no_app;
