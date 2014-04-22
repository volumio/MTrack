/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var config = require('twit');

var Twit = require('twit')

var T = new Twit({
    consumer_key:         '2siVfQEdmEXzhxei37Kc1jlf7'
  , consumer_secret:      'RNocyGrGRvFNLGMfDhC0Tn8AtASKZlhmnwnn36XUQtetfN1EZb'
  , access_token:         '1635817243-zzOdR909fhZKCXShfCvqL0BFPK7MZApCOma5qJc'
  , access_token_secret:  'kP3YMxmhEDzcnkowBGEXvXRaSpCyZesQo8jXs9FUCpjlJ'
})

function notify_user_for_feedback(user)
{
    T.post('direct_messages/new', { user:user ,text: 'Hi this is MTrack! You received a feedback'}, function(err, reply) {
   
})
}

function notify_user_for_exception(user)
{
    T.post('direct_messages/new', { user:user ,text: 'Hi this is MTrack! An exception has been catched!'}, function(err, reply) {
   
})
}


module.exports.notify_user_for_feedback = notify_user_for_feedback;
module.exports.notify_user_for_exception = notify_user_for_exception;