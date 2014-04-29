/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var config = require('twit');

var Twit = require('twit')

var T = new Twit({
    consumer_key:         'WNK6VXhDc49KDMiO1xoYypBrK'
  , consumer_secret:      '8Zy8MrWmSFhJQbAaNQ2R77UcQoC10DmhaQHvbHdZUqBnDqEgKp'
  , access_token:         '2510517519-qolfRkCg7j1FbWPc3CsB8UGBfcwS6GWuInihAZu'
  , access_token_secret:  '0ceoaqngcIVYTiB5LUSFc1vnrMHdmwdPDtkUufrEqtIVZ'
})

function notify_user_for_feedback(user)
{
    T.post('direct_messages/new', { user:user ,text: 'Hi this is MTrack! You received a feedback'}, function(err, reply) {
        if(err!=null)
            console.log(err);
   
})
}

function notify_user_for_exception(user)
{
    T.post('direct_messages/new', { user:user ,text: 'Hi this is MTrack! An exception has been catched!'}, function(err, reply) {
    if(err!=null)
            console.log(err);
   
})
}


module.exports.notify_user_for_feedback = notify_user_for_feedback;
module.exports.notify_user_for_exception = notify_user_for_exception;