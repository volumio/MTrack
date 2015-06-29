/**
 * Created by massi on 29/06/15.
 */

var client=require('mtrack-node');
var async=require('async');
var exec=require('child_process').exec;
var getmac=require('getmac');


var server_url='http://52.11.239.127:9080';
var currentVersionMajor=0;
var currentVersionMinor=0;
var uid;

async.series([
        calculateCurrentVersion,
        readMac,
        sendHBeat
    ],
    function(err,data){
        if(err!=null)
        {
            console.log(err);
        }
    });



function readMac(callback)
{
    getmac.getMac(function(err,macAddress){
        if (err)  callback(err)
        else{
            uid=macAddress;
            callback();
        }
    })
}

function calculateCurrentVersion(callback)
{
    var commandLine="git -C /volumio describe --abbrev=0 --tags";
    exec(commandLine , function (error, stdout, stderr) {
        if (error != null) {
            callback("Cannot calculate current version. Details: "+error);
        }
        else {
            var dotIndex=stdout.indexOf(".");

            var majorCut=stdout.substring(0,dotIndex).trim();
            currentVersionMajor=parseInt(majorCut);

            var minorCut=stdout.substring(dotIndex+1).trim();
            currentVersionMinor=parseInt(minorCut);

            //logger.info("Current version is "+currentVersionMajor+"."+currentVersionMinor);

            callback();
        }});
}

function sendHBeat(callback)
{
    var options={
        url:server_url,
        app_id:1,
        locale:"UNKNOWN",
        appversion:currentVersionMajor+"."+currentVersionMinor,
        uid:uid
    };

    client.sendHBeat(options,function(resp)
    {
        console.log("Hbeat sent to host");
    });

    callback();
}