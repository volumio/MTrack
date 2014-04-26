/* 
 This source code is property of Massimiliano Fanciulli.
 If you received it from a thrid party,
 please contact fanciulli@gmail.com
 */
var fs=require('fs');

var data_storage = require('../../server/backend_config.js').get_data_storage();

function get_toc(req,res)
{
    if (req.params.appId !== undefined)
    {
        var top=fs.readFileSync('api/misc/help_toc_top',null);
        var bottom=fs.readFileSync('api/misc/help_toc_bottom',null);
        
        res.set('Content-Type', 'text/html');
        
        data_storage.get_help_toc(req.params.appId,  function(data)
        {
            var content="";
            
            for(var i in data)
            {
                var item=JSON.parse(data[i]);
                content+="<li><a href=\"http://www.m-track.it:9080/api/1/help/"+req.params.appId+"/"+item.page_id+"\">"+item.text+"</a></li>";
            }
            res.send(new Buffer(top+content+bottom));
       
        });
    }
    else res.send(400, 'AppID should be specified');
}

function get_page(req,res)
{
        var top=fs.readFileSync('api/misc/help_page_top',null);
        var bottom=fs.readFileSync('api/misc/help_page_bottom',null);
        
        res.set('Content-Type', 'text/html');
        
        data_storage.get_help_page(req.params.appId,req.params.pageId,  function(data)
        {
            res.send(new Buffer(top+data+bottom));
       
        });
    
}


module.exports.get_toc=get_toc;
module.exports.get_page=get_page;

